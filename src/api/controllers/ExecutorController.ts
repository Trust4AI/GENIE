import container from '../config/container'
import { Request, Response } from 'express'
import { getBaseUrl } from '../utils/modelUtils'
import ExecutorBaseService from '../services/ExecutorBaseService'

class ExecutorController {
    executorBaseService: ExecutorBaseService
    ollamaPort: number = parseInt(
        process.env.OLLAMA_BASE_URL?.split(':')[-1] || '11434'
    )
    constructor() {
        this.executorBaseService = container.resolve('executorBaseService')
        this.index = this.index.bind(this)
        this.indexDetails = this.indexDetails.bind(this)
        this.indexOllama = this.indexOllama.bind(this)
        this.add = this.add.bind(this)
        this.update = this.update.bind(this)
        this.remove = this.remove.bind(this)
        this.check = this.check.bind(this)
        this.execute = this.execute.bind(this)
    }

    index(req: Request, res: Response): void {
        try {
            const models: string[] = this.executorBaseService.index()
            res.json(models)
        } catch (error: any) {
            res.status(500).send({ error: error.message })
        }
    }

    indexDetails(req: Request, res: Response): void {
        try {
            const models = this.executorBaseService.indexDetails()
            res.json(models)
        } catch (error: any) {
            res.status(500).send({ error: error.message })
        }
    }

    add(req: Request, res: Response): void {
        try {
            const {
                category,
                id,
                name,
                base_url = getBaseUrl(id),
                port = this.ollamaPort,
            }: {
                category: string
                id: string
                name: string
                base_url: string
                port: number
            } = req.body
            const model = this.executorBaseService.addModel(
                category,
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

    update(req: Request, res: Response): void {
        try {
            const { id } = req.params
            const {
                name,
                base_url = getBaseUrl(id),
                port = this.ollamaPort,
            }: {
                name: string
                base_url: string
                port: number
            } = req.body
            const model = this.executorBaseService.updateModel(
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

    remove(req: Request, res: Response): void {
        try {
            const { id } = req.params
            const result: boolean = this.executorBaseService.remove(id)
            const message: string = result
                ? 'Successfully removed.'
                : 'Could not remove model.'
            res.send({ message })
        } catch (error: any) {
            res.status(500).send({ error: error.message })
        }
    }

    async indexOllama(req: Request, res: Response): Promise<void> {
        try {
            const models = await this.executorBaseService.indexOllama()
            res.json(models)
        } catch (error: any) {
            res.status(500).send({ error: error.message })
        }
    }

    check(req: Request, res: Response): void {
        try {
            const message = this.executorBaseService.check()
            res.json(message)
        } catch (error: any) {
            res.status(500).send({ error: error.message })
        }
    }

    async execute(req: Request, res: Response): Promise<void> {
        try {
            const {
                model_name,
                system_prompt = '',
                user_prompt,
                response_max_length = -1,
                list_format_response = false,
                exclude_bias_references = false,
                excluded_text = '',
                format = 'text',
            }: {
                model_name: string
                system_prompt: string
                user_prompt: string
                response_max_length: number
                list_format_response: boolean
                exclude_bias_references: boolean
                excluded_text: string
                format: string
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
