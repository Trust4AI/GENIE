import container from '../config/container'
import { Request, Response } from 'express'
import { getBaseUrl } from '../utils/modelUtils'
import ModelBaseService from '../services/ModelBaseService'
import config from '../config/config'
import { ExecuteRequestDTO } from '../utils/objects/ExecuteRequestDTO'

class ModelController {
    modelBaseService: ModelBaseService
    ollamaPort: number = parseInt(config.ollamaPort)
    constructor() {
        this.modelBaseService = container.resolve('modelBaseService')
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
            const models: string[] = this.modelBaseService.index()
            res.json(models)
        } catch (error: any) {
            res.status(500).send({ error: error.message })
        }
    }

    indexDetails(req: Request, res: Response): void {
        try {
            const models = this.modelBaseService.indexDetails()
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
            const model = this.modelBaseService.addModel(
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
            const model = this.modelBaseService.updateModel(
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
            const result: boolean = this.modelBaseService.remove(id)
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
            const models = await this.modelBaseService.indexOllama()
            res.json(models)
        } catch (error: any) {
            res.status(500).send({ error: error.message })
        }
    }

    check(req: Request, res: Response): void {
        try {
            const message = this.modelBaseService.check()
            res.json(message)
        } catch (error: any) {
            res.status(500).send({ error: error.message })
        }
    }

    async execute(req: Request, res: Response): Promise<void> {
        try {
            const dto: ExecuteRequestDTO = new ExecuteRequestDTO(req.body)
            const modelResponse = await this.modelBaseService.execute(dto)
            res.send({ response: modelResponse })
        } catch (error: any) {
            res.status(500).send({ error: error.message })
        }
    }
}

export default ModelController
