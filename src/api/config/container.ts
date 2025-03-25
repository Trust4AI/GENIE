import { createContainer, asClass, AwilixContainer } from 'awilix'

import ModelBaseService from '../services/ModelBaseService'
import ExecutorBaseService from '../services/ExecutorBaseService'
import OllamaModelService from '../services/OllamaModelService'
import OpenAIModelService from '../services/OpenAIModelService'
import GeminiModelService from '../services/GeminiModelService'

function initContainer(): AwilixContainer {
    const container: AwilixContainer = createContainer()

    container.register({
        modelBaseService: asClass(ModelBaseService).singleton(),
        executorBaseService: asClass(ExecutorBaseService).singleton(),
        ollamaModelService: asClass(OllamaModelService).singleton(),
        openaiModelService: asClass(OpenAIModelService).singleton(),
        geminiModelService: asClass(GeminiModelService).singleton(),
    })
    return container
}

const container: AwilixContainer = initContainer()

export default container
