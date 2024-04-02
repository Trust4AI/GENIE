import { OllamaModel } from '../interfaces/OllamaModel'

const models: { [name: string]: OllamaModel } = {
    'gemma-2b': {
        name: 'gemma:2b',
        host:
            process.env.GEMMA_HOST || process.env.NODE_ENV === 'docker'
                ? 'http://gemma:11434'
                : 'http://localhost:11434',
    },
    gemma: {
        name: 'gemma:latest',
        host:
            process.env.GEMMA_HOST || process.env.NODE_ENV === 'docker'
                ? 'http://gemma:11434'
                : 'http://localhost:11434',
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
