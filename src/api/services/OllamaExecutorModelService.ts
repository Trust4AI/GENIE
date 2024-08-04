import { debugLog } from '../utils/logUtils'
import { getModelConfig } from '../utils/modelUtils'
import { sendChatRequest } from '../utils/ollamaUtils'

class OllamaExecutorModelService {
    async sendPromptToModel(
        modelName: string,
        systemPrompt: string,
        userPrompt: string,
        responseMaxLength: number,
        listFormatResponse: boolean,
        excludeBiasReferences: boolean,
        excludedText: string
    ): Promise<string> {
        const modelData = await getModelConfig(modelName)

        if (!modelData) {
            throw new Error(
                'Model specified does not exist. Please check the models defined in the configuration.'
            )
        }

        const model = modelData.name
        const host = modelData.host

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

        debugLog(`Host: ${host}`, 'info')
        debugLog(`Model: ${model}`, 'info')
        debugLog(`System prompt: ${auxSystemPrompt} ${systemPrompt}`, 'info')
        debugLog(`User prompt: ${userPrompt}`, 'info')

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
        //TODO: Remove once properNames evaluation is reviewed
        //console.log(messages)

        try {
            const response = await sendChatRequest(host, {
                model,
                stream: false,
                messages,
            }).then((res) => res.message.content)
            //TODO: Remove once properNames evaluation is reviewed
            //console.log(response)
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
