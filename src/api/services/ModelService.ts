import container from '../containers/container'
import { writeResponseToFile } from '../utils/files'

class ModelService {
    ollamaModelService: any
    constructor() {
        this.ollamaModelService = container.resolve('ollamaModelService')
    }

    check() {
        return { message: 'Executor component is working properly!' }
    }

    async request(
        role: string,
        prompt: string,
        model_name: string,
        max_length: number
    ) {
        const response: string =
            await this.ollamaModelService.sendPromptToModel(
                role,
                prompt,
                model_name,
                max_length
            )

        writeResponseToFile(role, model_name, prompt, response)
        return response
    }
}

export default ModelService
