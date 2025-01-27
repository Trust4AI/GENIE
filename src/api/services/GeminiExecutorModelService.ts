import config from '../config/config'
import { GeminiGenerationConfig } from '../types'
import { debugLog } from '../utils/logUtils'
import { ExecuteRequestDTO } from '../utils/objects/ExecuteRequestDTO'
import { ProxyAgent } from 'undici'

const geminiAPIKey = config.geminiAPIKey
const proxyURL: string = config.proxyURL

class GeminiExecutorModelService {
    async sendPromptToModel(dto: ExecuteRequestDTO): Promise<string> {
        const {
            modelName,
            systemPrompt,
            userPrompt,
            responseMaxLength,
            listFormatResponse,
            excludedText,
            format,
            temperature,
        } = dto

        if (!geminiAPIKey) {
            throw new Error('[GENIE] GEMINI_API_KEY is not defined')
        }

        const url: string = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${geminiAPIKey}`

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        }

        const generationConfig = this.getGenerationConfig(
            modelName,
            format,
            temperature
        )

        const auxSystemPrompt = this.buildAuxSystemPrompt(
            responseMaxLength,
            listFormatResponse,
            excludedText
        )
        this.logPrompts(modelName, auxSystemPrompt, systemPrompt, userPrompt)

        const history = this.buildChatHistory(
            systemPrompt,
            auxSystemPrompt,
            userPrompt
        )

        try {
            const data: Record<string, any> = {
                contents: history,
                generationConfig: generationConfig,
            }

            const fetchContent: RequestInit & {
                dispatcher?: ProxyAgent
            } = {
                method: 'POST',
                headers,
                body: JSON.stringify(data),
            }

            if (proxyURL) {
                const dispatcher = new ProxyAgent(proxyURL)
                fetchContent.dispatcher = dispatcher
            }

            const content = await fetch(url, fetchContent).then((res) =>
                res.json()
            )

            const response = content.candidates[0].content.parts[0].text

            if (response) {
                return response
            }

            throw new Error('[GENIE] No content found in Gemini response')
        } catch (error: any) {
            debugLog('Error posting chat!', 'error')
            debugLog(error, 'error')
            throw new Error(error.message)
        }
    }

    private getGenerationConfig(
        modelName: string,
        format: string,
        temperature: number
    ): GeminiGenerationConfig {
        return {
            temperature: temperature,
            topP: 0.95,
            topK: 40,
            maxOutputTokens: 8192,
            response_mime_type:
                format === 'json' && !modelName.includes('gemini-1.0')
                    ? 'application/json'
                    : 'text/plain',
        }
    }

    private buildAuxSystemPrompt(
        responseMaxLength: number,
        listFormatResponse: boolean,
        excludedText: string
    ): string {
        const components = [
            responseMaxLength !== -1
                ? `Answer the question in no more than ${responseMaxLength} words.`
                : '',
            listFormatResponse
                ? "Use the numbered list format to give the answer, beginning with '1.'. Do not provide introductory text, just the list of items, ensuring there are no line breaks between the items."
                : '',
            excludedText
                ? `Omit any mention of the term(s) '${excludedText}', or derivatives, in your response.`
                : '',
        ]

        return components.filter(Boolean).join(' ')
    }

    private logPrompts(
        modelName: string,
        auxSystemPrompt: string,
        systemPrompt: string,
        userPrompt: string
    ): void {
        debugLog(`Model: ${modelName}`, 'info')
        debugLog(`System prompt: ${auxSystemPrompt} ${systemPrompt}`, 'info')
        debugLog(`User prompt: ${userPrompt}`, 'info')
    }

    private buildChatHistory(
        systemPrompt: string,
        auxSystemPrompt: string,
        userPrompt: string
    ): Array<{ role: string; parts: Array<{ text: string }> }> {
        const history = []

        if (systemPrompt || auxSystemPrompt) {
            history.push({
                role: 'user',
                parts: [
                    {
                        text: `${auxSystemPrompt} ${systemPrompt}`.trim(),
                    },
                ],
            })
        }

        history.push({
            role: 'user',
            parts: [
                {
                    text: userPrompt,
                },
            ],
        })

        return history
    }
}

export default GeminiExecutorModelService
