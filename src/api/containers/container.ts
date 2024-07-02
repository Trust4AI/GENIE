import { createContainer, asClass } from 'awilix'

import BaseService from '../services/BaseService'
import OllamaExecutorModelService from '../services/OllamaExecutorModelService'

function initContainer() {
    const container = createContainer()

    container.register({
        baseService: asClass(BaseService).singleton(),
        ollamaExecutorModelService: asClass(
            OllamaExecutorModelService
        ).singleton(),
    })
    return container
}

const container = initContainer()

export default container
