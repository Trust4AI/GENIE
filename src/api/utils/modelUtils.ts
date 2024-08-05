import fs from 'fs/promises'

async function loadModels() {
    const data = await fs.readFile('api/config/models.json', 'utf-8')
    const models = JSON.parse(data)
    return Object.fromEntries(
        Object.entries(models).map(([key, val]: [string, any]) => [
            key,
            extractModel(val.name, val.url),
        ])
    )
}

async function getModelConfig(key: string) {
    const models = await loadModels()
    return models[key] ? { name: models[key].name, url: models[key].url } : null
}

async function getModelIds() {
    const models = await loadModels()
    return Object.keys(models)
}

async function addOrUpdateModel(
    key: string,
    name: string,
    base_url: string,
    port: number
) {
    const models = await loadModels()
    models[key] = createModel(name, base_url, port)
    await fs.writeFile(
        'api/config/models.json',
        JSON.stringify(models),
        'utf-8'
    )
}

async function removeModel(key: string) {
    const models = await loadModels()
    delete models[key]
    await fs.writeFile(
        'api/config/models.json',
        JSON.stringify(models),
        'utf-8'
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
