import OpenAI from 'openai'
import { debugLog } from '../utils/logUtils'

const openaiAPIKey: string = process.env.OPENAI_API_KEY ?? ''

const openai: OpenAI = new OpenAI({
    apiKey: openaiAPIKey,
})

class OpenAIExecutorModelService {
    async sendPromptToModel(
        modelName: string,
        systemPrompt: string,
        userPrompt: string,
        responseMaxLength: number,
        listFormatResponse: boolean,
        excludedText: string,
        format: string,
        temperature: number
    ): Promise<string> {
        if (!openaiAPIKey) {
            throw new Error('[GENIE] OPENAI_API_KEY is not defined')
        }

        const auxSystemPrompt = this.buildAuxSystemPrompt(
            responseMaxLength,
            listFormatResponse,
            excludedText
        )

        this.logPrompts(modelName, auxSystemPrompt, systemPrompt, userPrompt)

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
            temperature,
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

export default OpenAIExecutorModelService
