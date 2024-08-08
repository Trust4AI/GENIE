import fs from 'fs/promises'

const MODELS_CONFIG_FILE = 'api/config/models.json'

const loadModels = async () => {
    const data = await fs.readFile(MODELS_CONFIG_FILE, 'utf8')
    const models = JSON.parse(data)
    return Object.fromEntries(
        Object.entries(models).map(([key, val]: [string, any]) => [
            key,
            extractModel(val.name, val.url),
        ])
    )
}

const getModelConfig = async (key: string) => {
    const models = await loadModels()
    return models[key] ? { name: models[key].name, url: models[key].url } : null
}

const getModelIds = async () => {
    const models = await loadModels()
    return Object.keys(models)
}

const addOrUpdateModel = async (
    key: string,
    name: string,
    base_url: string,
    port: number
) => {
    const models = await loadModels()
    models[key] = createModel(name, base_url, port)
    await fs.writeFile(
        MODELS_CONFIG_FILE,
        JSON.stringify(models, null, 4),
        'utf8'
    )
}

const removeModel = async (key: string) => {
    const models = await loadModels()
    delete models[key]
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
    getModelConfig,
    getModelIds,
    getBaseUrl,
    addOrUpdateModel,
    removeModel,
}
