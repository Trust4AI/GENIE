import config from '../config/config'
import container from '../config/container'
import {
    addModel,
    updateModel,
    getModelIds,
    getModels,
    removeModel,
} from '../utils/modelUtils'
import { ExecuteRequestDTO } from '../utils/objects/ExecuteRequestDTO'
import { getOllamaModels } from '../utils/ollamaUtils'
import GeminiExecutorModelService from './GeminiExecutorModelService'
import OllamaExecutorModelService from './OllamaExecutorModelService'
import OpenAIExecutorModelService from './OpenAIExecutorModelService'
//import { writeOutputToFile } from '../utils/fileUtils'

class ModelBaseService {
    ollamaExecutorModelService: OllamaExecutorModelService
    openaiExecutorModelService: OpenAIExecutorModelService
    geminiExecutorModelService: GeminiExecutorModelService
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

    exists(id: string): boolean {
        const modelIds: string[] = getModelIds()
        return modelIds.includes(id)
    }

    index(): string[] {
        const models: string[] = getModelIds()
        return models
    }

    indexDetails() {
        const models = getModels()
        return models
    }

    addModel(
        category: string,
        id: string,
        name: string,
        base_url: string,
        port: number
    ) {
        addModel(category, id, name, base_url, port)
        if (category === 'ollama') {
            return { category, id, name, url: base_url }
        }
        return { category, id }
    }

    updateModel(id: string, name: string, base_url: string, port: number) {
        updateModel(id, name, base_url, port)
        return { id, name, url: base_url }
    }

    remove(id: string) {
        removeModel(id)
        return true
    }

    async indexOllama() {
        const nodeEnv = config.nodeEnv
        if (nodeEnv !== 'docker') {
            const ollamaBaseUrl = config.ollamaBaseUrl
            const models = getOllamaModels(ollamaBaseUrl)
            return models
        }

        throw new Error(
            '[GENIE] Ollama models cannot be fetched in docker environment.'
        )
    }

    check() {
        return { message: 'The model routes are working properly!' }
    }

    async execute(dto: ExecuteRequestDTO) {
        const executorModelService = this.getExecutorModelService(dto.modelName)
        const response: string = await executorModelService.sendPromptToModel(
            dto
        )

        //writeOutputToFile(modelName, userPrompt, response)
        return response
    }

    private getExecutorModelService(modelName: string) {
        const openAIModelIds = getModelIds('openai')
        const geminiModelIds = getModelIds('gemini')

        if (openAIModelIds.includes(modelName)) {
            return this.openaiExecutorModelService
        }
        if (geminiModelIds.includes(modelName)) {
            return this.geminiExecutorModelService
        }
        return this.ollamaExecutorModelService
    }
}

export default ModelBaseService
