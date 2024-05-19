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
                prompt,
                model_name = 'gemma',
                excluded_text,
            } = req.body
            const modelName = model_name
            const excludedText = excluded_text || ''
            const evaluationData = await this.modelService.execute(
                role,
                prompt,
                modelName,
                excludedText
            )
            res.send({ response: evaluationData })
        } catch (err: any) {
            res.status(500).send({ error: err.message })
        }
    }
}

export default ModelController
