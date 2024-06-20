abstract class AbstractCandidateService {
    abstract sendPromptToModel(
        userPrompt: string,
        modelName: string,
        excludedText: string,
        responseMaxLength: number,
        listFormatResponse: boolean,
        excludeBiasReferences: boolean,
        systemPrompt: string
    ): Promise<string>
}

export default AbstractCandidateService
