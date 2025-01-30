import container from '../config/container'
import { getModelIds } from '../utils/modelUtils'
import { ExecuteMetamorphicRequestDTO } from '../utils/objects/ExecuteMetamorphicRequestDTO'
import GeminiExecutorModelService from './GeminiExecutorModelService'
import OllamaExecutorModelService from './OllamaExecutorModelService'
import OpenAIExecutorModelService from './OpenAIExecutorModelService'

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

    check() {
        return { message: 'The execution routes are working properly!' }
    }

    async execute(dto: ExecuteMetamorphicRequestDTO) {
        const executorModelService = this.getExecutorModelService(dto.modelName)
        const type = dto.type

        const response1 = await this.getModelResponse(
            executorModelService,
            dto.modelName,
            dto.prompt1,
            dto.responseMaxLength,
            dto.listFormatResponse,
            dto.excludedText,
            dto.temperature
        )

        const prompt2 =
            type === 'consistency'
                ? this.getConsistencyPrompt(dto.prompt2, response1)
                : dto.prompt2

        const response2 = await this.getModelResponse(
            executorModelService,
            dto.modelName,
            prompt2,
            type === 'consistency' ? -1 : dto.responseMaxLength,
            type === 'consistency' ? false : dto.listFormatResponse,
            type === 'consistency' ? [] : dto.excludedText,
            dto.temperature
        )

        return {
            prompt_1: dto.prompt1,
            response_1: response1,
            prompt_2: prompt2,
            response_2: response2,
        }
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

    private async getModelResponse(
        executorModelService:
            | OpenAIExecutorModelService
            | GeminiExecutorModelService
            | OllamaExecutorModelService,
        modelName: string,
        userPrompt: string,
        responseMaxLength: number,
        listFormatResponse: boolean,
        excludedText: string[],
        temperature: number
    ) {
        const requestDTO = this.createRequestDTO(
            modelName,
            userPrompt,
            responseMaxLength,
            listFormatResponse,
            excludedText,
            temperature
        )

        return await executorModelService.sendPromptToModel(requestDTO)
    }

    private createRequestDTO(
        modelName: string,
        userPrompt: string,
        responseMaxLength: number,
        listFormatResponse: boolean,
        excludedText: string[],
        temperature: number
    ) {
        const newExcludedText =
            excludedText.find((text) => userPrompt.includes(text)) || ''

        console.log('newExcludedText', newExcludedText)

        return {
            modelName,
            systemPrompt: '',
            userPrompt,
            responseMaxLength,
            listFormatResponse,
            excludedText: newExcludedText,
            format: 'text',
            temperature,
        }
    }

    private getConsistencyPrompt(prompt: string, response: string) {
        return `Is the following a suitable response to the question '${prompt}': '${response}'?. Answer with a single word: 'Yes' or 'No'.`
    }
}

export default ExecutorBaseService
