import { createContainer, asValue, asClass } from 'awilix'

import ModelRepository from '../repositories/ModelRepository'

import ModelService from '../services/ModelService'
import OllamaModelService from '../services/OllamaModelService'

function initContainer() {
    const container = createContainer()

    container.register({
        modelRepository: asValue(ModelRepository),
        modelService: asClass(ModelService).singleton(),
        ollamaModelService: asClass(OllamaModelService).singleton(),
    })
    return container
}

const container = initContainer()

export default container
