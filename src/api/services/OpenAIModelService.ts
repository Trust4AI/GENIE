import OpenAI from 'openai'
import { debugLog } from '../utils/logUtils'
import config from '../config/config'
import { ExecuteRequestDTO } from '../utils/objects/ExecuteRequestDTO'
import { buildAuxSystemPrompt, logPrompts } from '../utils/promptUtils'

const openaiAPIKey: string = config.openaiAPIKey

const openai: OpenAI = new OpenAI({
    apiKey: openaiAPIKey,
})

class OpenAIModelService {
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
            excludedText,
            format,
            temperature,
        } = dto
        if (!openaiAPIKey) {
            throw new Error('[GENIE] OPENAI_API_KEY is not defined')
        }

        const auxSystemPrompt = buildAuxSystemPrompt(
            responseMaxLength,
            listFormatResponse,
            numericFormatResponse,
            yesNoFormatResponse,
            multipleChoiceFormatResponse,
            excludedText
        )

        logPrompts(modelName, auxSystemPrompt, systemPrompt, userPrompt)

        const messages = this.buildMessages(
            auxSystemPrompt,
            systemPrompt,
            userPrompt
        )
        const params = this.buildParams(
            modelName,
            messages,
            format,
            temperature
        )

        try {
            const response = await this.fetchCompletion(params)
            debugLog('Chat posted successfully!', 'info')
            debugLog(`Response from OpenAI: ${response}`, 'info')
            return response
        } catch (error: any) {
            debugLog('Error posting chat!', 'error')
            debugLog(error, 'error')
            throw new Error(error.message)
        }
    }

    private buildMessages(
        auxSystemPrompt: string,
        systemPrompt: string,
        userPrompt: string
    ): OpenAI.Chat.ChatCompletionMessageParam[] {
        const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
            { role: 'user', content: userPrompt },
        ]

        if (systemPrompt || auxSystemPrompt) {
            messages.unshift({
                role: 'system',
                content: `${auxSystemPrompt} ${systemPrompt}`.trim(),
            })
        }

        return messages
    }

    private buildParams(
        modelName: string,
        messages: OpenAI.Chat.ChatCompletionMessageParam[],
        format: string,
        temperature: number
    ): OpenAI.Chat.ChatCompletionCreateParams {
        const params: OpenAI.Chat.ChatCompletionCreateParams = {
            model: modelName,
            messages,
        }

        if (temperature !== -1) {
            params.temperature = temperature
        }

        if (format === 'json') {
            params.response_format = { type: 'json_object' }
        }

        return params
    }

    private async fetchCompletion(params: any): Promise<string> {
        const completion = await openai.chat.completions.create(params)
        const content = completion.choices[0]?.message?.content

        if (!content) {
            throw new Error(
                '[GUARD-ME] No content found in OpenAI GPT response'
            )
        }

        return content
    }
}

export default OpenAIModelService
