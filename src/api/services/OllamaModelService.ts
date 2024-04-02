import { getModelConfig } from '../config/models'
import AbstractOllamaModelService from './AbstractOllamaModelService'
import { Ollama } from 'ollama'

class OllamaModelService extends AbstractOllamaModelService {
    async sendPromptToModel(
        prompt: string,
        modelName: string
    ): Promise<string> {
        const modelData = getModelConfig(modelName)
        const model = modelData?.name ?? 'gemma:2b'
        const host = modelData?.host ?? 'http://localhost:11434'
        const ollama = new Ollama({ host })

        const response = await ollama.chat({
            model: model,
            messages: [
                {
                    role: 'user',
                    content: prompt,
                },
            ],
        })
        return response.message.content
    }
}

export default OllamaModelService
