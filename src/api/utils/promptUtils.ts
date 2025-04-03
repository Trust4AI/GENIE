import { debugLog } from './logUtils'

function logPrompts(
    model: string,
    auxSystemPrompt: string,
    systemPrompt: string,
    userPrompt: string
): void {
    debugLog(`Model: ${model}`, 'info')
    debugLog(`System prompt: ${auxSystemPrompt} ${systemPrompt}`, 'info')
    debugLog(`User prompt: ${userPrompt}`, 'info')
}

function buildAuxSystemPrompt(
    responseMaxLength: number,
    listFormatResponse: boolean,
    numericFormatResponse: boolean,
    yesNoFormatResponse: boolean,
    multipleChoiceFormatResponse: boolean,
    completionFormatResponse: boolean,
    excludedText: string
): string {
    const components = [
        responseMaxLength !== -1
            ? `Answer in no more than ${responseMaxLength} words.`
            : '',
        listFormatResponse
            ? "Use the numbered list format to give the answer, beginning with '1.'. Do not provide introductory text, just the list of items, ensuring there are no line breaks between the items."
            : '',
        numericFormatResponse
            ? 'Answer with a number. Do not provide introductory text just the number.'
            : '',
        yesNoFormatResponse ? "Answer with a simple 'yes' or 'no'." : '',
        multipleChoiceFormatResponse
            ? "Answer with a simple 'A)', 'B)' or 'C)'."
            : '',
        excludedText
            ? `Omit any mention of the term(s) '${excludedText}', or derivatives, in your response.`
            : '',
        completionFormatResponse ? 'Complete the following sentence: ' : '',
    ]

    return components.filter(Boolean).join(' ')
}

export { logPrompts, buildAuxSystemPrompt }
