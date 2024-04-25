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
    'gemma-list-response': {
        name: 'gemma-list-response:latest',
        host:
            process.env.GEMMA_HOST || process.env.NODE_ENV === 'docker'
                ? 'http://gemma-list-response:11435'
                : 'http://localhost:11435',
    },
    'gemma-no-references': {
        name: 'gemma-no-references:latest',
        host:
            process.env.GEMMA_HOST || process.env.NODE_ENV === 'docker'
                ? 'http://gemma-no-references:11436'
                : 'http://localhost:11436',
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
