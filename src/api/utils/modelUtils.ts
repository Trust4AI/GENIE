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

const getModels = async () => {
    const models = await loadModels()
    return models
}

const getModelConfig = async (key: string) => {
    const models = await loadModels()
    return models.ollama[key] ? models.ollama[key] : null
}

const addOrUpdateModel = async (
    category: string,
    id: string,
    name: string,
    base_url: string,
    port: number
) => {
    const models = await readFile()

    if (category !== 'ollama' && !models[category].includes(id)) {
        models[category].push(id)
    } else {
        models.ollama[id] = createModel(name, base_url, port)
    }

    await fs.writeFile(
        MODELS_CONFIG_FILE,
        JSON.stringify(models, null, 4),
        'utf8'
    )
}

const removeModel = async (id: string) => {
    const models = await readFile()
    for (const category of MODEL_CATEGORIES) {
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

const createModel = (name: string, base_url: string, port: number) => {
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
    getModelIds,
    getModels,
    getModelCategories,
    getModelConfig,
    getBaseUrl,
    addOrUpdateModel,
    removeModel,
}
