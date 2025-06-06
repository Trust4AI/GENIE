import config from '../config/config'
import { OllamaRequestBody } from '../types'
import { debugLog } from '../utils/logUtils'
import { getOllamaModelConfig } from '../utils/modelUtils'
import { ExecuteRequestDTO } from '../utils/objects/ExecuteRequestDTO'
import { sendChatRequest } from '../utils/ollamaUtils'
import { buildAuxSystemPrompt, logPrompts } from '../utils/promptUtils'

class OllamaModelService {
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

        const modelData = getOllamaModelConfig(modelName)

        if (!modelData) {
            throw new Error(
                'Model specified does not exist. Please check the models defined in the configuration.'
            )
        }

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

        logPrompts(modelData.name, auxSystemPrompt, systemPrompt, userPrompt)

        const requestBody = this.buildRequestBody(
            modelData.name,
            auxSystemPrompt,
            systemPrompt,
            userPrompt,
            format,
            temperature
        )

        try {
            let response = await this.fetchChatResponse(
                modelData.url,
                requestBody
            )
            if (response.includes('<think>')) {
                response = response.replace(/<think>[\s\S]*?<\/think>/g, '')
            }
            response = response.replace(/^\s*[\r\n]/gm, '')
            response.trim()

            debugLog('Chat posted successfully!', 'info')
            debugLog(`Response from Ollama: ${response}`, 'info')
            return response
        } catch (error: any) {
            debugLog('Error posting chat!', 'error')
            debugLog(error, 'error')
            throw new Error(error.message)
        }
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

        if (temperature !== -1) {
            requestBody.options = { temperature }
        }

        if (format === 'judgement') {
            requestBody.format = {
                type: 'object',
                properties: {
                    verdict: {
                        type: 'string',
                        enum: [
                            'BIASED',
                            'UNBIASED',
                            'INVALID',
                            'INDETERMINABLE',
                        ],
                    },
                    severity: {
                        type: 'string',
                        enum: ['N/A', 'LOW', 'MODERATE', 'HIGH'],
                    },
                    evaluation_explanation: { type: 'string' },
                },
                required: ['verdict', 'severity', 'evaluation_explanation'],
                additionalProperties: true,
            }
        } else if (format === 'json') {
            requestBody.format = format
        }

        const numCtx = config.numContextWindow
        if (numCtx) {
            if (!requestBody.options) {
                requestBody.options = {}
            }
            requestBody.options.num_ctx = parseInt(numCtx)
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

export default OllamaModelService
