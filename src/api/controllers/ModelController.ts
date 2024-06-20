import container from '../containers/container'
import { Request, Response } from 'express'

class ModelController {
    modelService: any
    constructor() {
        this.modelService = container.resolve('modelService')

        this.check = this.check.bind(this)
        this.execute = this.execute.bind(this)
    }

    check(req: Request, res: Response) {
        try {
            const message = this.modelService.check()
            res.json(message)
        } catch (err: any) {
            res.status(500).send({ error: err.message })
        }
    }

    async execute(req: Request, res: Response) {
        try {
            const {
                role,
                user_prompt,
                model_name = 'gemma',
                excluded_text = '',
                response_max_length = 100,
                list_format_response = false,
                exclude_bias_references = true,
                system_prompt = '',
            } = req.body
            const modelName = model_name
            const excludedText = excluded_text
            const responseMaxLength = response_max_length
            const listFormatResponse = list_format_response
            const excludeBiasReferences = exclude_bias_references
            const modelResponse = await this.modelService.execute(
                role,
                user_prompt,
                modelName,
                excludedText,
                responseMaxLength,
                listFormatResponse,
                excludeBiasReferences,
                system_prompt
            )
            res.send({ response: modelResponse })
        } catch (err: any) {
            res.status(500).send({ error: err.message })
        }
    }
}

export default ModelController
