import { createContainer, asClass } from 'awilix'

import ExecutorBaseService from '../services/ExecutorBaseService'
import OllamaExecutorModelService from '../services/OllamaExecutorModelService'

function initContainer() {
    const container = createContainer()

    container.register({
        executorBaseService: asClass(ExecutorBaseService).singleton(),
        ollamaExecutorModelService: asClass(
            OllamaExecutorModelService
        ).singleton(),
    })
    return container
}

const container = initContainer()

export default container
