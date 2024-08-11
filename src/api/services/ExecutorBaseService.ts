import { format } from 'path'
import container from '../config/container'
import {
    addOrUpdateModel,
    getModelConfig,
    getModelIds,
    removeModel,
} from '../utils/modelUtils'
import { getOllamaModels } from '../utils/ollamaUtils'
//import { writeResponseToFile } from '../utils/fileUtils'

class ExecutorBaseService {
    ollamaExecutorModelService: any
    constructor() {
        this.ollamaExecutorModelService = container.resolve(
            'ollamaExecutorModelService'
        )
    }

    async exists(id: string) {
        return (await getModelConfig(id)) !== null
    }

    async index() {
        const modelIds = await getModelIds()
        const models = await Promise.all(
            modelIds.map(async (id: string) => {
                const config = await getModelConfig(id)
                return {
                    id,
                    name: config?.name,
                    url: config?.url,
                }
            })
        )
        return models
    }

    async addOrUpdateModel(
        id: string,
        name: string,
        base_url: string,
        port: number
    ) {
        await addOrUpdateModel(id, name, base_url, port)
        return { id, name, url: `${base_url}:${port}` }
    }

    async remove(id: string) {
        const config = await getModelConfig(id)
        if (!config) {
            throw new Error(`Model with id ${id} does not exist`)
        }
        await removeModel(id)
        return true
    }

    async indexOllama() {
        const ollamaBaseUrl =
            process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434'
        const models = getOllamaModels(ollamaBaseUrl)

        return models
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
        excludedText: string,
        format: string
    ) {
        const response: string =
            await this.ollamaExecutorModelService.sendPromptToModel(
                modelName,
                systemPrompt,
                userPrompt,
                responseMaxLength,
                listFormatResponse,
                excludeBiasReferences,
                excludedText,
                format
            )

        //writeResponseToFile(modelName, userPrompt, response)
        return response
    }
}

export default ExecutorBaseService
