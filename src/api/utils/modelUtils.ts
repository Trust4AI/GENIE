const createModel = (name: string, port: number) => {
    return {
        name,
        host: process.env.OLLAMA_HOST || getHostUrl(name, port),
    }
}

const getHostUrl = (modelName: string, port: number): string => {
    return process.env.NODE_ENV === 'docker'
        ? `http://${modelName.replace(':', '-')}:${port}`
        : 'http://localhost:' + port
}

export { createModel, getHostUrl }
