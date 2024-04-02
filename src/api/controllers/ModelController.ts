import container from '../containers/container'
import { Request, Response } from 'express'

class ModelController {
    modelService: any
    constructor() {
        this.modelService = container.resolve('modelService')

        this.check = this.check.bind(this)
        this.request = this.request.bind(this)
    }

    check(req: Request, res: Response) {
        try {
            const message = this.modelService.check()
            res.json(message)
        } catch (err: any) {
            res.status(500).send({ error: err.message })
        }
    }

    async request(req: Request, res: Response) {
        try {
            const { role, prompt, modelName = 'gemma' } = req.body
            const evaluationData = await this.modelService.request(
                role,
                prompt,
                modelName
            )
            res.send({ response: evaluationData })
        } catch (err: any) {
            res.status(500).send({ error: err.message })
        }
    }
}

export default ModelController
