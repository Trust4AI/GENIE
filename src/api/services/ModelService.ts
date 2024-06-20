import container from '../containers/container'

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
        userPrompt: string,
        modelName: string,
        excludedText: string,
        responseMaxLength: number,
        listFormatResponse: boolean,
        excludeBiasReferences: boolean,
        systemPrompt: string
    ) {
        const response: string =
            await this.ollamaModelService.sendPromptToModel(
                userPrompt,
                modelName,
                excludedText,
                responseMaxLength,
                listFormatResponse,
                excludeBiasReferences,
                systemPrompt
            )

        //TODO: Review if it is necessary to write the response to a file
        // writeResponseToFile(role, modelName, userPrompt, response)
        return response
    }
}

export default ModelService
