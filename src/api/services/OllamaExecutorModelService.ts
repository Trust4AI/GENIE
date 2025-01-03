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
        const modelData = getOllamaModelConfig(modelName)

        if (!modelData) {
            throw new Error(
                'Model specified does not exist. Please check the models defined in the configuration.'
            )
        }

        const auxSystemPrompt = this.buildAuxSystemPrompt(
            responseMaxLength,
            listFormatResponse,
            excludeBiasReferences,
            excludedText
        )

        this.logPrompts(
            modelData.url,
            modelData.name,
            auxSystemPrompt,
            systemPrompt,
            userPrompt
        )

        const requestBody = this.buildRequestBody(
            modelData.name,
            auxSystemPrompt,
            systemPrompt,
            userPrompt,
            format
        )

        try {
            const response = await this.fetchChatResponse(
                modelData.url,
                requestBody
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

    private getModelData(modelName: string) {
        const modelData = getOllamaModelConfig(modelName)

        if (!modelData) {
            throw new Error(
                'Model specified does not exist. Please check the models defined in the configuration.'
            )
        }

        return modelData
    }

    private buildAuxSystemPrompt(
        responseMaxLength: number,
        listFormatResponse: boolean,
        excludeBiasReferences: boolean,
        excludedText: string
    ): string {
        const components = [
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

        return components.filter(Boolean).join(' ')
    }

    private logPrompts(
        url: string,
        model: string,
        auxSystemPrompt: string,
        systemPrompt: string,
        userPrompt: string
    ): void {
        debugLog(`URL: ${url}`, 'info')
        debugLog(`Model: ${model}`, 'info')
        debugLog(`System prompt: ${auxSystemPrompt} ${systemPrompt}`, 'info')
        debugLog(`User prompt: ${userPrompt}`, 'info')
    }

    private buildRequestBody(
        model: string,
        auxSystemPrompt: string,
        systemPrompt: string,
        userPrompt: string,
        format: string
    ): OllamaRequestBody {
        const messages = [{ role: 'user', content: userPrompt }]

        if (systemPrompt || auxSystemPrompt) {
            messages.unshift({
                role: 'system',
                content: `${auxSystemPrompt} ${systemPrompt}`.trim(),
            })
        }

        const requestBody: OllamaRequestBody = {
            model,
            stream: false,
            messages,
        }

        const num_ctx = process.env.NUM_CONTEXT_WINDOW
        if (num_ctx) {
            requestBody.options = { num_ctx: parseInt(num_ctx) }
        }

        if (format === 'json') {
            requestBody.format = format
        }

        return requestBody
    }

    private async fetchChatResponse(
        url: string,
        requestBody: OllamaRequestBody
    ): Promise<string> {
        return sendChatRequest(url, requestBody).then(
            (res) => res.message.content
        )
    }
}

export default OllamaExecutorModelService
