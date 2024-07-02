import container from '../containers/container'
//import { writeResponseToFile } from '../utils/fileUtils'

class ExecutorBaseService {
    ollamaExecutorModelService: any
    constructor() {
        this.ollamaExecutorModelService = container.resolve(
            'ollamaExecutorModelService'
        )
    }

    check() {
        return { message: 'Executor component is working properly!' }
    }

    async execute(
        modelName: string,
        systemPrompt: string,
        userPrompt: string,
        responseMaxLength: number,
        listFormatResponse: boolean,
        excludeBiasReferences: boolean,
        excludedText: string
    ) {
        const response: string =
            await this.ollamaExecutorModelService.sendPromptToModel(
                modelName,
                systemPrompt,
                userPrompt,
                responseMaxLength,
                listFormatResponse,
                excludeBiasReferences,
                excludedText
            )

        //writeResponseToFile(modelName, userPrompt, response)
        return response
    }
}

export default ExecutorBaseService
