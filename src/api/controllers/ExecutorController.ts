import container from '../config/container'
import { Request, Response } from 'express'

class ExecutorController {
    executorBaseService: any
    constructor() {
        this.executorBaseService = container.resolve('executorBaseService')

        this.index = this.index.bind(this)
        this.add = this.add.bind(this)
        this.update = this.update.bind(this)
        this.remove = this.remove.bind(this)
        this.indexOllama = this.indexOllama.bind(this)
        this.check = this.check.bind(this)
        this.execute = this.execute.bind(this)
    }

    async index(req: Request, res: Response) {
        try {
            const models = await this.executorBaseService.index()
            res.send({ models })
        } catch (error: any) {
            res.status(500).send({ error: error.message })
        }
    }

    async add(req: Request, res: Response) {
        try {
            const { id, name, port = 11434 } = req.body
            const model = await this.executorBaseService.addOrUpdateModel(
                id,
                name,
                port
            )
            res.send({ model })
        } catch (error: any) {
            res.status(500).send({ error: error.message })
        }
    }

    async update(req: Request, res: Response) {
        try {
            const { id } = req.params
            const { name, port = 11434 } = req.body
            const model = await this.executorBaseService.addOrUpdateModel(
                id,
                name,
                port
            )
            res.send({ model })
        } catch (error: any) {
            res.status(500).send({ error: error.message })
        }
    }

    async remove(req: Request, res: Response) {
        try {
            const { id } = req.params
            const result = await this.executorBaseService.remove(id)
            const message = result
                ? 'Successfully removed.'
                : 'Could not remove model.'
            res.send({ message })
        } catch (error: any) {
            res.status(500).send({ error: error.message })
        }
    }

    async indexOllama(req: Request, res: Response) {
        try {
            const models = await this.executorBaseService.indexOllama()
            res.send({ models })
        } catch (error: any) {
            res.status(500).send({ error: error.message })
        }
    }

    check(req: Request, res: Response) {
        try {
            const message = this.executorBaseService.check()
            res.json(message)
        } catch (error: any) {
            res.status(500).send({ error: error.message })
        }
    }

    async execute(req: Request, res: Response) {
        try {
            const {
                model_name,
                system_prompt = '',
                user_prompt,
                response_max_length = -1,
                list_format_response = false,
                exclude_bias_references = true,
                excluded_text = '',
            } = req.body
            const modelResponse = await this.executorBaseService.execute(
                model_name,
                system_prompt,
                user_prompt,
                response_max_length,
                list_format_response,
                exclude_bias_references,
                excluded_text
            )
            res.send({ response: modelResponse })
        } catch (error: any) {
            res.status(500).send({ error: error.message })
        }
    }
}

export default ExecutorController
