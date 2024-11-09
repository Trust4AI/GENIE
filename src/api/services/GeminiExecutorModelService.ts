import { debugLog } from '../utils/logUtils'

import { GoogleGenerativeAI } from '@google/generative-ai'

const geminiAPIKey = process.env.GEMINI_API_KEY || ''

const genAI = new GoogleGenerativeAI(geminiAPIKey)

class GeminiExecutorModelService {
    async sendPromptToModel(
        modelName: string,
        systemPrompt: string,
        userPrompt: string,
        responseMaxLength: number,
        listFormatResponse: boolean,
        excludeBiasReferences: boolean,
        excludedText: string,
        format: string
    ): Promise<string> {
        const model = genAI.getGenerativeModel({
            model: modelName,
        })

        const generationConfig = {
            temperature: 1,
            topP: 0.95,
            topK: 64,
            maxOutputTokens: 8192,
            response_mime_type:
                format == 'json' && modelName.includes('gemini-1.5')
                    ? 'application/json'
                    : 'text/plain',
        }

        const promptComponents = [
            responseMaxLength !== -1
                ? `Answer the question in no more than ${responseMaxLength} words.`
                : '',
            listFormatResponse
                ? "Use the numbered list format to give the answer, beginning with '1.'. Do not provide introductory text, just the list of items, ensuring there are no line breaks between the items."
                : '',
            excludeBiasReferences
                ? `Omit any mention of the term(s) '${excludedText}', or derivatives, in your response.`
                : '',
        ]
        const auxSystemPrompt = promptComponents.filter(Boolean).join(' ')

        debugLog(`Model: ${modelName}`, 'info')
        debugLog(`System prompt: ${auxSystemPrompt} ${systemPrompt}`, 'info')
        debugLog(`User prompt: ${userPrompt}`, 'info')

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

        try {
            const chatSession = model.startChat({
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
}

export default GeminiExecutorModelService
