import container from '../config/container'
import { Request, Response } from 'express'
import ExecutorBaseService from '../services/ExecutorBaseService'
import { ExecuteMetamorphicRequestDTO } from '../utils/objects/ExecuteMetamorphicRequestDTO'

class ExecutorController {
    executorBaseService: ExecutorBaseService
    constructor() {
        this.executorBaseService = container.resolve('executorBaseService')
        this.check = this.check.bind(this)
        this.execute = this.execute.bind(this)
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
            const dto: ExecuteMetamorphicRequestDTO =
                new ExecuteMetamorphicRequestDTO(req.body)
            const response = await this.executorBaseService.execute(dto)
            res.json(response)
        } catch (error: any) {
            res.status(500).send({ error: error.message })
        }
    }
}

export default ExecutorController
