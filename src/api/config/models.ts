import { OllamaModel } from '../interfaces/OllamaModel'

const models: { [name: string]: OllamaModel } = {
    'gemma-2b': {
        name: 'gemma-2b:latest',
        host:
            process.env.GEMMA_HOST || process.env.NODE_ENV === 'docker'
                ? 'http://gemma-2b:11434'
                : 'http://localhost:11434',
    },
    'llama3-8b': {
        name: 'llama3-8b:latest',
        host:
            process.env.GEMMA_HOST || process.env.NODE_ENV === 'docker'
                ? 'http://llama3-8b:11435'
                : 'http://localhost:11435',
    },
}

const getModelConfig = (key: string) => {
    if (models[key]) {
        return {
            name: models[key].name,
            host: models[key].host,
        }
    } else {
        return null
    }
}

export { getModelConfig }
