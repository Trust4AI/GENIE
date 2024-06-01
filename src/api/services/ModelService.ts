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

    async execute(
        role: string,
        prompt: string,
        modelName: string,
        excludedText: string,
        responseMaxLength: number,
        listFormatResponse: boolean,
        excludeBiasReferences: boolean
    ) {
        const response: string =
            await this.ollamaModelService.sendPromptToModel(
                prompt,
                modelName,
                excludedText,
                responseMaxLength,
                listFormatResponse,
                excludeBiasReferences
            )

        writeResponseToFile(role, modelName, prompt, response)
        return response
    }
}

export default ModelService
