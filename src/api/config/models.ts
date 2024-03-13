import { OllamaModel } from '../interfaces/OllamaModel'

const models: { [name: string]: OllamaModel } = {
    gemma: {
        name: 'gemma:2b',
        host:
            process.env.GEMMA_HOST || process.env.NODE_ENV === 'docker'
                ? 'http://gemma:11434'
                : 'http://localhost:11434',
    },
    'dolphin-phi': {
        name: 'dolphin-phi',
        host:
            process.env.DOLPHIN_HOST || process.env.NODE_ENV === 'docker'
                ? 'http://dolphin-phi:11434'
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
