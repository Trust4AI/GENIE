import config from '../config/config'
import { GeminiGenerationConfig } from '../types'
import { debugLog } from '../utils/logUtils'

import {
    ChatSession,
    GenerativeModel,
    GoogleGenerativeAI,
} from '@google/generative-ai'
import { ExecuteRequestDTO } from '../utils/objects/ExecuteRequestDTO'
import { buildAuxSystemPrompt, logPrompts } from '../utils/promptUtils'

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

        const auxSystemPrompt = buildAuxSystemPrompt(
            responseMaxLength,
            listFormatResponse,
            excludedText
        )
        logPrompts(modelName, auxSystemPrompt, systemPrompt, userPrompt)

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
            topK: 40,
            maxOutputTokens: 8192,
            response_mime_type:
                format === 'json' && !modelName.includes('gemini-1.0')
                    ? 'application/json'
                    : 'text/plain',
        }
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
