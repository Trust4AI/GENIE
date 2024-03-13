abstract class AbstractCandidateService {
    abstract sendPromptToModel(
        role: string,
        prompt: string,
        model_name: string,
        max_length: number
    ): Promise<string>
}

export default AbstractCandidateService
