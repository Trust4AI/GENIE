import fs from 'fs/promises'

const MODELS_CONFIG_FILE = 'api/config/models.json'
const MODEL_CATEGORIES = ['openai', 'gemini', 'ollama']

const readFile = async () => {
    const data = await fs.readFile(MODELS_CONFIG_FILE, 'utf8')
    return JSON.parse(data)
}

const loadModels = async () => {
    const jsonData = await readFile()
    const ollamaModels = Object.fromEntries(
        Object.entries(jsonData.ollama).map(([key, val]: [string, any]) => [
            key,
            extractModel(val.name, val.url),
        ])
    )
    return {
        ...jsonData,
        ollama: ollamaModels,
    }
}

const getModelCategories = () => {
    return MODEL_CATEGORIES
}

const getModels = async () => {
    const models = await loadModels()
    return models
}

const getModelIds = async (category?: string) => {
    const data = await readFile()

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

const getUsedOllaModels = async () => {
    const models = await loadModels()
    return Object.entries(models.ollama).map(([key, val]: [string, any]) => ({
        id: key,
        name: val.name,
    }))
}

const getOllamaModelConfig = async (key: string) => {
    const models = await loadModels()
    return models.ollama[key] ? models.ollama[key] : null
}

const addModel = async (
    category: string,
    id: string,
    name: string,
    base_url: string,
    port: number
) => {
    const models = await readFile()

    if (category !== 'ollama' && !models[category].includes(id)) {
        models[category].push(id)
    } else if (category === 'ollama') {
        models.ollama[id] = createOrUpdateModel(name, base_url, port)
    }

    await fs.writeFile(
        MODELS_CONFIG_FILE,
        JSON.stringify(models, null, 4),
        'utf8'
    )
}

const updateModel = async (
    id: string,
    name: string,
    base_url: string,
    port: number
) => {
    const models = await readFile()

    models.ollama[id] = createOrUpdateModel(name, base_url, port)

    await fs.writeFile(
        MODELS_CONFIG_FILE,
        JSON.stringify(models, null, 4),
        'utf8'
    )
}

const removeModel = async (id: string) => {
    const models = await readFile()
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
    await fs.writeFile(
        MODELS_CONFIG_FILE,
        JSON.stringify(models, null, 4),
        'utf8'
    )
}

const extractModel = (name: string, url: string) => {
    return {
        name,
        url,
    }
}

const createOrUpdateModel = (name: string, base_url: string, port: number) => {
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
