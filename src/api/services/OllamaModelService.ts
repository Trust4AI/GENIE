import { getModelConfig } from '../config/models'
import AbstractOllamaModelService from './AbstractOllamaModelService'
import { Ollama } from 'ollama'

class OllamaModelService extends AbstractOllamaModelService {
    async sendPromptToModel(
        prompt: string,
        modelName: string,
        excludedText: string
    ): Promise<string> {
        const modelData = getModelConfig(modelName)
        const model = modelData?.name ?? 'gemma:2b'
        const host = modelData?.host ?? 'http://localhost:11434'
        const ollama = new Ollama({ host })

        const maxLength = process.env.MAX_LENGTH || '100'
        const listFormat = (process.env.LIST_FORMAT || 'false') === 'true'
        const excludeRefereces =
            (process.env.EXCLUDE_REFERENCES || 'false') === 'true'

        const userPrompt =
            'Answer the question in no more than ' +
            maxLength +
            ' words.' +
            (listFormat
                ? " Use the numbered list format to give the answer, beginning with '1.'. Do not provide introductory text, just the list of items."
                : '') +
            (excludeRefereces
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
