type OllamaRequestBody = {
    model: string
    stream: boolean
    messages?: {
        role: string
        content: string
    }[]
    options?: any
    format?:
        | string
        | {
              type: string
              properties: any
              required: string[]
              additionalProperties: boolean
          }
}

type GeminiGenerationConfig = {
    temperature?: number
    topP?: number
    topK?: number
    maxOutputTokens?: number
    response_mime_type?: string
}

type LogType = 'error' | 'warn' | 'info' | 'log'

export { OllamaRequestBody, GeminiGenerationConfig, LogType }
