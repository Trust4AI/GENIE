import { OllamaRequestBody } from '../types'
import { debugLog } from '../utils/logUtils'
import { getOllamaModelConfig } from '../utils/modelUtils'
import { sendChatRequest } from '../utils/ollamaUtils'

class OllamaExecutorModelService {
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
        const modelData = await getOllamaModelConfig(modelName)

        if (!modelData) {
            throw new Error(
                'Model specified does not exist. Please check the models defined in the configuration.'
            )
        }

        const model = modelData.name
        const url = modelData.url

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

        debugLog(`URL: ${url}`, 'info')
        debugLog(`Model: ${model}`, 'info')
        debugLog(`System prompt: ${auxSystemPrompt} ${systemPrompt}`, 'info')
        debugLog(`User prompt: ${userPrompt}`, 'info')

        const requestBody: OllamaRequestBody = {
            model,
            stream: false,
        }

        const messages = [
            {
                role: 'user',
                content: userPrompt,
            },
        ]

        if (systemPrompt || auxSystemPrompt) {
            messages.unshift({
                role: 'system',
                content: `${auxSystemPrompt} ${systemPrompt}`,
            })
        }
        requestBody['messages'] = messages

        const num_ctx = process.env.NUM_CONTEXT_WINDOW

        if (num_ctx) {
            const options: any = {}
            options['num_ctx'] = parseInt(num_ctx)
            requestBody['options'] = options
        }

        if (format === 'json') {
            requestBody['format'] = format
        }

        try {
            const response = await sendChatRequest(url, requestBody).then(
                (res) => res.message.content
            )
            debugLog('Chat posted successfully!', 'info')
            debugLog(`Response from Ollama: ${response}`, 'info')
            return response
        } catch (error: any) {
            debugLog('Error posting chat!', 'error')
            debugLog(error, 'error')
            throw new Error(error.message)
        }
    }
}

export default OllamaExecutorModelService
