const sendChatRequest = async (
    host: string,
    requestBody: object
): Promise<any> => {
    let response: Response

    try {
        response = await fetch(`${host}/api/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        })
    } catch (error: any) {
        throw new Error(`[EXECUTOR] Ollama fetch failed: ${error.message}`)
    }

    if (!response.ok) {
        throw new Error(
            `[EXECUTOR] Failed to post chat to Ollama: ${response.status} ${response.statusText}`
        )
    }
    return response.json()
}

export { sendChatRequest }
