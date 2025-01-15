export class ExecuteRequestDTO {
    modelName: string
    systemPrompt: string
    userPrompt: string
    responseMaxLength: number
    listFormatResponse: boolean
    excludedText: string
    format: string
    temperature: number

    constructor(data: any) {
        this.modelName = data.model_name
        this.systemPrompt = data.system_prompt || ''
        this.userPrompt = data.user_prompt
        this.responseMaxLength = data.response_max_length || -1
        this.listFormatResponse = data.list_format_response || false
        this.excludedText = data.excluded_text || ''
        this.format = data.format || 'text'
        this.temperature = data.temperature || 0.5
    }
}
