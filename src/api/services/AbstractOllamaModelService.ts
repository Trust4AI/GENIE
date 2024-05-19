abstract class AbstractCandidateService {
    abstract sendPromptToModel(
        prompt: string,
        modelName: string,
        excludedText: string
    ): Promise<string>
}

export default AbstractCandidateService
