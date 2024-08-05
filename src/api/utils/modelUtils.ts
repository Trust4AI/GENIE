import fs from 'fs/promises'

async function loadModels() {
    const data = await fs.readFile('api/config/models.json', 'utf-8')
    const models = JSON.parse(data)
    return Object.fromEntries(
        Object.entries(models).map(([key, val]: [string, any]) => [
            key,
            extractModel(val.name, val.host),
        ])
    )
}

async function getModelConfig(key: string) {
    const models = await loadModels()
    return models[key]
        ? { name: models[key].name, host: models[key].host }
        : null
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

const extractModel = (name: string, host: string) => {
    return {
        name,
        host,
    }
}

const createModel = (name: string, base_url: string, port: number) => {
    return {
        name,
        host: `${base_url}:${port}`,
    }
}

const getBaseUrl = (id: string): string => {
    return process.env.NODE_ENV === 'docker'
        ? `http://${id}`
        : `${
              process.env.OLLAMA_HOST?.replace(/:\d+/, '') || 'http://127.0.0.1'
          }`
}

export {
    getModelConfig,
    getModelIds,
    getBaseUrl,
    addOrUpdateModel,
    removeModel,
}
