import { getModelConfig } from '../config/models'
import AbstractOllamaModelService from './AbstractOllamaModelService'

class OllamaModelService extends AbstractOllamaModelService {
    async sendPromptToModel(
        userPrompt: string,
        modelName: string,
        excludedText: string,
        responseMaxLength: number,
        listFormatResponse: boolean,
        excludeBiasReferences: boolean,
        systemPrompt: string
    ): Promise<string> {
        const modelData = getModelConfig(modelName)
        const model = modelData?.name ?? 'gemma:2b'
        const host = modelData?.host ?? 'http://172.0.0.1:11434'

        const fullUserPrompt =
            (responseMaxLength !== -1
                ? 'Answer the question in no more than ' +
                  responseMaxLength.toString() +
                  ' words.'
                : '') +
            (listFormatResponse
                ? " Use the numbered list format to give the answer, beginning with '1.'. Do not provide introductory text, just the list of items, ensuring there are no line breaks between the items."
                : '') +
            (excludeBiasReferences
                ? " Omit any mention of the term(s) '" +
                  excludedText +
                  "', or derivatives, in your response."
                : '') +
            ' Question: ' +
            userPrompt +
            ' Response: '

        console.log('Host:', host)
        console.log('Model:', model)
        console.log('User Prompt:', userPrompt)

        const messages = [
            {
                role: 'user',
                content: fullUserPrompt,
            },
        ]

        if (systemPrompt.length > 0) {
            messages.unshift({
                role: 'system',
                content: systemPrompt,
            })
        }

        const requestbody = {
            model: model,
            stream: false,
            messages: messages,
        }

        try {
            const response = await fetch(host + '/api/chat', {
                method: 'POST',
                body: JSON.stringify(requestbody),
            })

            if (response.ok) {
                const jsonResponse = await response.json()
                console.log('Chat posted successfully!')
                console.log('Response from Ollama:', jsonResponse)
                return jsonResponse.message.content
            } else {
                console.error(
                    'Failed to post chat to Ollama',
                    response.status,
                    response.statusText
                )
            }
        } catch (error) {
            console.error('Error posting chat to Ollama:', error)
        }
        return 'Error posting chat to Ollama'
    }
}

export default OllamaModelService
