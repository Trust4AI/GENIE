interface GenerationConfig {
    temperature: number
    topP: number
    topK: number
    maxOutputTokens: number
    response_mime_type: string
}

export { GenerationConfig }
