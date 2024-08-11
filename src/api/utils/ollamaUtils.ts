const sendChatRequest = async (
    ollamaBaseUrl: string,
    requestBody: object
): Promise<any> => {
    let response: Response

    try {
        response = await fetch(`${ollamaBaseUrl}/api/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        })
    } catch (error: any) {
        throw new Error(`[GENIE] Ollama fetch error: ${error.message}`)
    }

    if (!response.ok) {
        throw new Error(
            `[GENIE] Failed to post chat to Ollama: ${response.status} ${response.statusText}`
        )
    }
    return response.json()
}

const getOllamaModels = async (ollamaBaseUrl: string): Promise<any> => {
    let response: any
    try {
        response = await fetch(`${ollamaBaseUrl}/api/tags`, {
            method: 'GET',
        })
    } catch (error: any) {
        throw new Error(`[GENIE] Ollama fetch error: ${error.message}`)
    }

    if (!response.ok) {
        throw new Error(
            `[GENIE] Failed to get Ollama models: ${response.status} ${response.statusText}`
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
