import { OllamaModel } from '../interfaces/OllamaModel'
import { createModel } from '../utils/modelUtils'

const models: { [name: string]: OllamaModel } = {
    'llama3-8b': createModel('llama3:8b', 11433),
    'llama2-7b': createModel('llama2:7b', 11436),
    'mistral-7b': createModel('mistral:7b', 11437),
    'gemma-7b': createModel('gemma:7b', 11438),
}

const getModelConfig = (key: string) => {
    return models[key]
        ? { name: models[key].name, host: models[key].host }
        : null
}

export { getModelConfig }
