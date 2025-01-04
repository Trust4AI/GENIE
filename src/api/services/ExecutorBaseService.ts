import container from '../config/container'
import {
    addModel,
    updateModel,
    getModelIds,
    getModels,
    removeModel,
} from '../utils/modelUtils'
import { getOllamaModels } from '../utils/ollamaUtils'
import GeminiExecutorModelService from './GeminiExecutorModelService'
import OllamaExecutorModelService from './OllamaExecutorModelService'
import OpenAIExecutorModelService from './OpenAIExecutorModelService'
//import { writeOutputToFile } from '../utils/fileUtils'

class ExecutorBaseService {
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
        excludedText: string,
        format: string,
        temperature: number
    ) {
        const executorModelService = this.getExecutorModelService(modelName)
        const response: string = await executorModelService.sendPromptToModel(
            modelName,
            systemPrompt,
            userPrompt,
            responseMaxLength,
            listFormatResponse,
            excludedText,
            format,
            temperature
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

export default ExecutorBaseService
