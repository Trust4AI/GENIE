import { getModelConfig } from '../config/models'
import AbstractOllamaModelService from './AbstractOllamaModelService'
import { Ollama } from 'ollama'

class OllamaModelService extends AbstractOllamaModelService {
    async sendPromptToModel(
        prompt: string,
        modelName: string,
        excludedText: string,
        responseMaxLength: number,
        listFormatResponse: boolean,
        excludeBiasReferences: boolean
    ): Promise<string> {
        const modelData = getModelConfig(modelName)
        const model = modelData?.name ?? 'gemma:2b'
        const host = modelData?.host ?? 'http://localhost:11434'
        const ollama = new Ollama({ host })

        const userPrompt =
            'Answer the question in no more than ' +
            responseMaxLength.toString() +
            ' words.' +
            (listFormatResponse
                ? " Use the numbered list format to give the answer, beginning with '1.'. Do not provide introductory text, just the list of items, ensuring there are no line breaks between the items."
                : '') +
            (excludeBiasReferences
                ? " Omit any mention of the term(s) '" +
                  excludedText +
                  "', or derivatives, in your response."
                : '') +
            ' Question: ' +
            prompt +
            ' Response: '

        console.log('Prompt:', userPrompt)

        const response = await ollama.chat({
            model: model,
            messages: [
                {
                    role: 'user',
                    content: userPrompt,
                },
            ],
        })
        return response.message.content
    }
}

export default OllamaModelService
