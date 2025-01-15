import config from '../config/config'
import { OllamaRequestBody } from '../types'
import { debugLog } from '../utils/logUtils'
import { getOllamaModelConfig } from '../utils/modelUtils'
import { ExecuteRequestDTO } from '../utils/objects/ExecuteRequestDTO'
import { sendChatRequest } from '../utils/ollamaUtils'

class OllamaExecutorModelService {
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

        const modelData = getOllamaModelConfig(modelName)

        if (!modelData) {
            throw new Error(
                'Model specified does not exist. Please check the models defined in the configuration.'
            )
        }

        const auxSystemPrompt = this.buildAuxSystemPrompt(
            responseMaxLength,
            listFormatResponse,
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
            format,
            temperature
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
        format: string,
        temperature: number
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

        requestBody.options = { temperature }

        const numCtx = config.numContextWindow
        if (numCtx) {
            requestBody.options.num_ctx = parseInt(numCtx)
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
