import './loadEnv'

const config = {
    port: process.env.PORT || '8081',
    numContextWindow: process.env.NUM_CONTEXT_WINDOW,
    nodeEnv: process.env.NODE_ENV || 'local',
    maxRetries: process.env.MAX_RETRIES || '5',
    debugMode: process.env.DEBUG_MODE === 'true',
    geminiAPIKey: process.env.GEMINI_API_KEY || '',
    openaiAPIKey: process.env.OPENAI_API_KEY || '',
    ollamaPort: process.env.OLLAMA_BASE_URL?.split(':')[-1] || '11434',
    ollamaBaseUrl: process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434',
}

export default config
