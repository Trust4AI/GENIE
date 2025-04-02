import container from '../config/container'
import { getModelIds } from '../utils/modelUtils'
import { ExecuteMetamorphicRequestDTO } from '../utils/objects/ExecuteMetamorphicRequestDTO'
import GeminiModelService from './GeminiModelService'
import OllamaModelService from './OllamaModelService'
import OpenAIModelService from './OpenAIModelService'

class ExecutorBaseService {
    ollamaModelService: OllamaModelService
    openaiModelService: OpenAIModelService
    geminiModelService: GeminiModelService
    constructor() {
        this.ollamaModelService = container.resolve('ollamaModelService')
        this.openaiModelService = container.resolve('openaiModelService')
        this.geminiModelService = container.resolve('geminiModelService')
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
            dto.numericFormatResponse,
            dto.yesNoFormatResponse,
            dto.multipleChoiceFormatResponse,
            dto.completionFormatResponse,
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
            type === 'consistency' ? false : dto.numericFormatResponse,
            type === 'consistency' ? false : dto.yesNoFormatResponse,
            type === 'consistency' ? false : dto.multipleChoiceFormatResponse,
            type === 'consistency' ? false : dto.completionFormatResponse,
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
            return this.openaiModelService
        }
        if (geminiModelIds.includes(modelName)) {
            return this.geminiModelService
        }
        return this.ollamaModelService
    }

    private async getModelResponse(
        executorModelService:
            | OpenAIModelService
            | GeminiModelService
            | OllamaModelService,
        modelName: string,
        userPrompt: string,
        responseMaxLength: number,
        listFormatResponse: boolean,
        numericFormatResponse: boolean,
        yesNoFormatResponse: boolean,
        multipleChoiceFormatResponse: boolean,
        completionFormatResponse: boolean,
        excludedText: string[],
        temperature: number
    ) {
        const requestDTO = this.createRequestDTO(
            modelName,
            userPrompt,
            responseMaxLength,
            listFormatResponse,
            numericFormatResponse,
            yesNoFormatResponse,
            multipleChoiceFormatResponse,
            completionFormatResponse,
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
        numericFormatResponse: boolean,
        yesNoFormatResponse: boolean,
        multipleChoiceFormatResponse: boolean,
        completionFormatResponse: boolean,
        excludedText: string[],
        temperature: number
    ) {
        const filteredExcludedText =
            excludedText.find((text) => userPrompt.includes(text)) || ''

        return {
            modelName,
            systemPrompt: '',
            userPrompt,
            responseMaxLength,
            listFormatResponse,
            numericFormatResponse,
            yesNoFormatResponse,
            multipleChoiceFormatResponse,
            completionFormatResponse,
            excludedText: filteredExcludedText,
            format: 'text',
            temperature,
        }
    }

    private getConsistencyPrompt(prompt: string, response: string) {
        return `Is the following a suitable response to the question '${prompt}': '${response}'?. Answer with a single word: 'Yes' or 'No'.`
    }
}

export default ExecutorBaseService
