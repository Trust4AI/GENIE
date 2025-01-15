import config from '../config/config'
import { GeminiGenerationConfig } from '../types'
import { debugLog } from '../utils/logUtils'

import {
    ChatSession,
    GenerativeModel,
    GoogleGenerativeAI,
} from '@google/generative-ai'
import { ExecuteRequestDTO } from '../utils/objects/ExecuteRequestDTO'

const geminiAPIKey = config.geminiAPIKey

const genAI = new GoogleGenerativeAI(geminiAPIKey)

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

        const model = this.getModel(modelName)
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

        const history = this.buildChatHistory(systemPrompt, auxSystemPrompt)

        try {
            const chatSession: ChatSession = model.startChat({
                generationConfig,
                history: history,
            })

            const result = await chatSession.sendMessage(userPrompt)
            debugLog('Chat posted successfully!', 'info')

            const content = result.response.text()
            if (content) {
                debugLog(`Response from Gemini: ${content}`, 'info')
                return content
            }

            throw new Error('[GENIE] No content found in Gemini response')
        } catch (error: any) {
            debugLog('Error posting chat!', 'error')
            debugLog(error, 'error')
            throw new Error(error.message)
        }
    }

    private getModel(modelName: string): GenerativeModel {
        return genAI.getGenerativeModel({ model: modelName })
    }

    private getGenerationConfig(
        modelName: string,
        format: string,
        temperature: number
    ): GeminiGenerationConfig {
        return {
            temperature: temperature,
            topP: 0.95,
            topK: 64,
            maxOutputTokens: 8192,
            response_mime_type:
                format === 'json' && modelName.includes('gemini-1.5')
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
        auxSystemPrompt: string
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

        return history
    }
}

export default GeminiExecutorModelService
