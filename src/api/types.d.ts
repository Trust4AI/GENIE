type OllamaRequestBody = {
    model: string
    stream: boolean
    messages?: {
        role: string
        content: string
    }[]
    options?: any
    format?: string
}

export { OllamaRequestBody }
