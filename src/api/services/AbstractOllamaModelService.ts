abstract class AbstractCandidateService {
    abstract sendPromptToModel(
        prompt: string,
        modelName: string
    ): Promise<string>
}

export default AbstractCandidateService
