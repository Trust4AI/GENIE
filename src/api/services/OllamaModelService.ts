import { getModelConfig } from '../config/models'
import generateRoleBasedPrompt from '../utils/prompts/systemRolePrompt'
import AbstractOllamaModelService from './AbstractOllamaModelService'
import { Ollama } from 'ollama'

class OllamaModelService extends AbstractOllamaModelService {
    async sendPromptToModel(
        role: string,
        prompt: string,
        model_name: string,
        max_length: number
    ): Promise<string> {
        const modelData = getModelConfig(model_name)
        const model = modelData?.name ?? 'gemma:2b'
        const host = modelData?.host ?? 'http://localhost:11434'
        const ollama = new Ollama({ host })

        const limitMessage = `Answer the question using less than ${max_length} words.`

        const messages = [
            {
                role: 'user',
                content: prompt + '\n' + limitMessage,
            },
        ]

        if (role) {
            messages.unshift({
                role: 'system',
                content: generateRoleBasedPrompt({ role }),
            })
        }

        const response = await ollama.chat({
            model: model,
            messages: messages,
        })
        return response.message.content
    }
}

export default OllamaModelService
