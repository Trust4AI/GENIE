import container from '../config/container'
import { Request, Response } from 'express'
import { getBaseUrl } from '../utils/modelUtils'

class ExecutorController {
    executorBaseService: any
    ollamaPort: number = parseInt(
        process.env.OLLAMA_BASE_URL?.split(':')[-1] || '11434'
    )
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
            res.json(models)
        } catch (error: any) {
            res.status(500).send({ error: error.message })
        }
    }

    async add(req: Request, res: Response) {
        try {
            const {
                id,
                name,
                base_url = getBaseUrl(id),
                port = this.ollamaPort,
            } = req.body
            const model = await this.executorBaseService.addOrUpdateModel(
                id,
                name,
                base_url,
                port
            )
            res.json(model)
        } catch (error: any) {
            res.status(500).send({ error: error.message })
        }
    }

    async update(req: Request, res: Response) {
        try {
            const { id } = req.params
            const {
                name,
                base_url = getBaseUrl(id),
                port = this.ollamaPort,
            } = req.body
            const model = await this.executorBaseService.addOrUpdateModel(
                id,
                name,
                base_url,
                port
            )
            res.json(model)
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
            res.json(models)
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
                format = 'text',
            } = req.body
            const modelResponse = await this.executorBaseService.execute(
                model_name,
                system_prompt,
                user_prompt,
                response_max_length,
                list_format_response,
                exclude_bias_references,
                excluded_text,
                format
            )
            res.send({ response: modelResponse })
        } catch (error: any) {
            res.status(500).send({ error: error.message })
        }
    }
}

export default ExecutorController
