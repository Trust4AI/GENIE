import { readJSONFile, writeJSONToFile } from './fileUtils'

const MODELS_CONFIG_FILE = 'api/config/models.json'
const MODEL_CATEGORIES = ['openai', 'gemini', 'ollama']

const loadModels = () => {
    const jsonData = readJSONFile(MODELS_CONFIG_FILE)
    const ollamaModels = Object.fromEntries(
        Object.entries(jsonData.ollama).map(([key, val]: [string, any]) => [
            key,
            { name: val.name, url: val.url },
        ])
    )
    return {
        ...jsonData,
        ollama: ollamaModels,
    }
}

const getModelCategories = (): string[] => {
    return MODEL_CATEGORIES
}

const getModels = () => {
    const models = loadModels()
    return models
}

const getModelIds = (category?: string): string[] => {
    const data = readJSONFile(MODELS_CONFIG_FILE)

    if (category) {
        if (category === 'ollama') {
            return Object.keys(data.ollama)
        }
        return data[category] || []
    }

    const openaiModels = data.openai
    const geminiModels = data.gemini
    const ollamaModels = Object.keys(data.ollama)

    return [...openaiModels, ...geminiModels, ...ollamaModels]
}

const getUsedOllaModels = (): { id: string; name: string }[] => {
    const models = loadModels()
    return Object.entries(models.ollama).map(([key, val]: [string, any]) => ({
        id: key,
        name: val.name,
    }))
}

const getOllamaModelConfig = (
    key: string
): { name: string; url: string } | null => {
    const models = loadModels()
    return models.ollama[key] ? models.ollama[key] : null
}

const addModel = (
    category: string,
    id: string,
    name: string,
    base_url: string,
    port: number
): void => {
    const models = readJSONFile(MODELS_CONFIG_FILE)

    if (category !== 'ollama' && !models[category].includes(id)) {
        models[category].push(id)
    } else if (category === 'ollama') {
        models.ollama[id] = createOrUpdateModel(name, base_url, port)
    }
    writeJSONToFile(MODELS_CONFIG_FILE, models)
}

const updateModel = (
    id: string,
    name: string,
    base_url: string,
    port: number
): void => {
    const models = readJSONFile(MODELS_CONFIG_FILE)

    models.ollama[id] = createOrUpdateModel(name, base_url, port)

    writeJSONToFile(MODELS_CONFIG_FILE, models)
}

const removeModel = (id: string): void => {
    const models = readJSONFile(MODELS_CONFIG_FILE)
    for (const category of MODEL_CATEGORIES) {
        if (category === 'ollama') {
            if (models[category]?.[id]) {
                delete models[category][id]
            }
            continue
        }
        if (models[category]?.includes(id)) {
            models[category] = models[category].filter((k: string) => k !== id)
        }
    }
    writeJSONToFile(MODELS_CONFIG_FILE, models)
}

const createOrUpdateModel = (
    name: string,
    base_url: string,
    port: number
): {
    name: string
    url: string
} => {
    return {
        name,
        url: `${base_url}:${port}`,
    }
}

const getBaseUrl = (id: string): string => {
    return process.env.NODE_ENV === 'docker'
        ? `http://${id}`
        : `${
              process.env.OLLAMA_BASE_URL?.replace(/:\d+/, '') ||
              'http://127.0.0.1'
          }`
}

export {
    getModels,
    getModelIds,
    getModelCategories,
    getUsedOllaModels,
    getOllamaModelConfig,
    getBaseUrl,
    addModel,
    updateModel,
    removeModel,
}
