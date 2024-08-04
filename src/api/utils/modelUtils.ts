import fs from 'fs/promises'

async function loadModels() {
    const data = await fs.readFile('api/config/models.json', 'utf-8')
    const models = JSON.parse(data)
    return Object.fromEntries(
        Object.entries(models).map(([key, val]: [string, any]) => [
            key,
            createModel(key, val.name, val.port),
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

async function addOrUpdateModel(key: string, name: string, port: number) {
    const models = await loadModels()
    models[key] = createModel(key, name, port)
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

const createModel = (key: string, name: string, port: number) => {
    return {
        name,
        host: process.env.OLLAMA_HOST || getHostUrl(key, port),
    }
}

const getHostUrl = (key: string, port: number): string => {
    return process.env.NODE_ENV === 'docker'
        ? `http://${key}:${port}`
        : `http://127.0.0.1:${port}`
}

export {
    getModelConfig,
    getModelIds,
    getHostUrl,
    addOrUpdateModel,
    removeModel,
}
