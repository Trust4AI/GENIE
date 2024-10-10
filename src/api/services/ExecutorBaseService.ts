import container from '../config/container'
import { HistoryItem } from '../interfaces/interfaces'
import {
    addModel,
    updateModel,
    getModelIds,
    getModels,
    removeModel,
} from '../utils/modelUtils'
import { getOllamaModels } from '../utils/ollamaUtils'
//import { writeResponseToFile } from '../utils/fileUtils'

class ExecutorBaseService {
    ollamaExecutorModelService: any
    openaiExecutorModelService: any
    geminiExecutorModelService: any
    constructor() {
        this.ollamaExecutorModelService = container.resolve(
            'ollamaExecutorModelService'
        )
        this.openaiExecutorModelService = container.resolve(
            'openaiExecutorModelService'
        )
        this.geminiExecutorModelService = container.resolve(
            'geminiExecutorModelService'
        )
    }

    async exists(id: string) {
        const modelIds = await getModelIds()
        return modelIds.includes(id)
    }

    async index() {
        const models = await getModelIds()
        return models
    }

    async indexDetails() {
        const models = await getModels()
        return models
    }

    async addModel(
        category: string,
        id: string,
        name: string,
        base_url: string,
        port: number
    ) {
        await addModel(category, id, name, base_url, port)
        if (category === 'ollama') {
            return { category, id, name, url: base_url }
        }
        return { category, id }
    }

    async updateModel(
        id: string,
        name: string,
        base_url: string,
        port: number
    ) {
        await updateModel(id, name, base_url, port)
        return { id, name, url: base_url }
    }

    async remove(id: string) {
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
        return { message: 'GENIE is working properly!' }
    }

    async execute(
        modelName: string,
        systemPrompt: string,
        userPrompt: string,
        responseMaxLength: number,
        listFormatResponse: boolean,
        excludeBiasReferences: boolean,
        excludedText: string,
        format: string,
        temperature: number,
        history: HistoryItem[]
    ) {
        const executorModelService = await this.getExecutorModelService(
            modelName
        )
        const response: string = await executorModelService.sendPromptToModel(
            modelName,
            systemPrompt,
            userPrompt,
            responseMaxLength,
            listFormatResponse,
            excludeBiasReferences,
            excludedText,
            format,
            temperature,
            history
        )

        //writeResponseToFile(modelName, userPrompt, response)
        return response
    }

    private async getExecutorModelService(modelName: string) {
        const openAIModelIds = await getModelIds('openai')
        const geminiModelIds = await getModelIds('gemini')

        if (openAIModelIds.includes(modelName)) {
            return this.openaiExecutorModelService
        }
        if (geminiModelIds.includes(modelName)) {
            return this.geminiExecutorModelService
        }
        return this.ollamaExecutorModelService
    }
}

export default ExecutorBaseService
