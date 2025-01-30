export class ExecuteMetamorphicRequestDTO {
    modelName: string
    prompt1: string
    prompt2: string
    responseMaxLength: number
    listFormatResponse: boolean
    excludedText: string[]
    temperature: number
    type: string

    constructor(data: any) {
        this.modelName = data.model_name
        this.prompt1 = data.prompt_1
        this.prompt2 = data.prompt_2
        this.responseMaxLength = data.response_max_length || -1
        this.listFormatResponse = data.list_format_response || false
        this.excludedText = data.excluded_text || []
        this.temperature = data.temperature || 0.5
        this.type = data.type || 'comparison'
    }
}
