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

    async execute(role: string, prompt: string, modelName: string) {
        const response: string =
            await this.ollamaModelService.sendPromptToModel(prompt, modelName)

        writeResponseToFile(role, modelName, prompt, response)
        return response
    }
}

export default ModelService
