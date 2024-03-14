import { createContainer, asClass } from 'awilix'

import ModelService from '../services/ModelService'
import OllamaModelService from '../services/OllamaModelService'

function initContainer() {
    const container = createContainer()

    container.register({
        modelService: asClass(ModelService).singleton(),
        ollamaModelService: asClass(OllamaModelService).singleton(),
    })
    return container
}

const container = initContainer()

export default container
