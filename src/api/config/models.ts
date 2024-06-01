import { OllamaModel } from '../interfaces/OllamaModel'

const models: { [name: string]: OllamaModel } = {
    'llama3-8b': {
        name: 'llama3',
        host:
            process.env.LLAMA_HOST ||
            (process.env.NODE_ENV === 'docker'
                ? 'http://llama3-8b:11435'
                : 'http://localhost:11435'),
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
