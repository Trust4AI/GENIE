abstract class AbstractCandidateService {
    abstract sendPromptToModel(
        prompt: string,
        modelName: string,
        excludedText: string,
        responseMaxLength: number,
        listFormatResponse: boolean,
        excludeBiasReferences: boolean
    ): Promise<string>
}

export default AbstractCandidateService
