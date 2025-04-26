import config from '../config/config'
import { GeminiGenerationConfig } from '../types'
import { debugLog } from '../utils/logUtils'
import { ExecuteRequestDTO } from '../utils/objects/ExecuteRequestDTO'
import { ProxyAgent } from 'undici'
import { buildAuxSystemPrompt, logPrompts } from '../utils/promptUtils'

const geminiAPIKey = config.geminiAPIKey
const proxyURL: string = config.proxyURL

class GeminiModelService {
    async sendPromptToModel(dto: ExecuteRequestDTO): Promise<string> {
        const {
            modelName,
            systemPrompt,
            userPrompt,
            responseMaxLength,
            listFormatResponse,
            numericFormatResponse,
            yesNoFormatResponse,
            multipleChoiceFormatResponse,
            completionFormatResponse,
            rankFormatResponse,
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

        const auxSystemPrompt = buildAuxSystemPrompt(
            responseMaxLength,
            listFormatResponse,
            numericFormatResponse,
            yesNoFormatResponse,
            multipleChoiceFormatResponse,
            completionFormatResponse,
            rankFormatResponse,
            excludedText
        )
        logPrompts(modelName, auxSystemPrompt, systemPrompt, userPrompt)

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

            if (content.error) {
                throw new Error(`[GENIE] ${content.error.message}`)
            }
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
        const config: GeminiGenerationConfig = {
            // topP: 0.95,
            // topK: 40,
            // maxOutputTokens: 8192,
            response_mime_type:
                format === 'json' && !modelName.includes('gemini-1.0')
                    ? 'application/json'
                    : 'text/plain',
        }

        if (temperature !== -1) {
            config['temperature'] = temperature
        }

        return config
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

export default GeminiModelService
