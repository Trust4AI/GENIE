const sendChatRequest = async (
    baseURL: string,
    requestBody: object
): Promise<any> => {
    let response: Response

    try {
        response = await fetch(`${baseURL}/api/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        })
    } catch (error: any) {
        throw new Error(`[EXECUTOR] Ollama fetch error: ${error.message}`)
    }

    if (!response.ok) {
        throw new Error(
            `[EXECUTOR] Failed to post chat to Ollama: ${response.status} ${response.statusText}`
        )
    }
    return response.json()
}

const getOllamaModels = async (baseURL: string): Promise<any> => {
    let response: any
    try {
        response = await fetch(`${baseURL}/api/tags`, {
            method: 'GET',
        })
    } catch (error: any) {
        throw new Error(`[EXECUTOR] Ollama fetch error: ${error.message}`)
    }

    if (!response.ok) {
        throw new Error(
            `[EXECUTOR] Failed to get Ollama models: ${response.status} ${response.statusText}`
        )
    }

    const data = await response.json()

    const filteredModels = data.models.map((model: any) => ({
        name: model.name,
        model: model.model,
        modified_at: model.modified_at,
    }))

    return filteredModels
}

export { sendChatRequest, getOllamaModels }
