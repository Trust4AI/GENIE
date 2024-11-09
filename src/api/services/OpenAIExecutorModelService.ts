import OpenAI from 'openai'
import { debugLog } from '../utils/logUtils'

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
})

class OpenAIExecutorModelService {
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

        const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
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

        const params: OpenAI.Chat.ChatCompletionCreateParams = {
            model: modelName,
            messages,
        }

        if (format === 'json') {
            params['response_format'] = {
                type: 'json_object',
            }
        }

        try {
            const completion = await openai.chat.completions.create(params)
            debugLog('Chat posted successfully!', 'info')
            const content = completion.choices[0].message.content

            if (content) {
                debugLog(`Response from OpenAI: ${content}`, 'info')
                return content
            }
            throw new Error(
                '[GUARD-ME] No content found in OpenAI GPT response'
            )
        } catch (error: any) {
            debugLog('Error posting chat!', 'error')
            debugLog(error, 'error')
            throw new Error(error.message)
        }
    }
}

export default OpenAIExecutorModelService
