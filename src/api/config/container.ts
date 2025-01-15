import { createContainer, asClass, AwilixContainer } from 'awilix'

import ExecutorBaseService from '../services/ExecutorBaseService'
import OllamaExecutorModelService from '../services/OllamaExecutorModelService'
import OpenAIExecutorModelService from '../services/OpenAIExecutorModelService'
import GeminiExecutorModelService from '../services/GeminiExecutorModelService'

function initContainer(): AwilixContainer {
    const container: AwilixContainer = createContainer()

    container.register({
        executorBaseService: asClass(ExecutorBaseService).singleton(),
        ollamaExecutorModelService: asClass(
            OllamaExecutorModelService
        ).singleton(),
        openaiExecutorModelService: asClass(
            OpenAIExecutorModelService
        ).singleton(),
        geminiExecutorModelService: asClass(
            GeminiExecutorModelService
        ).singleton(),
    })
    return container
}

const container: AwilixContainer = initContainer()

export default container
