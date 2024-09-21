import { getOllaModelsDefined } from '../utils/modelUtils'

const checkOllamaModelExists =
    (idPathParamName: string) => async (req: any, res: any, next: any) => {
        const id = req.params[idPathParamName]

        const modelIds = await getOllaModelsDefined().then((models: any) =>
            models.map((model: any) => model.id)
        )

        if (!modelIds.includes(id)) {
            return res.status(404).send({
                error: `Model with id ${id} not found in Ollama configuration`,
            })
        }

        return next()
    }

export { checkOllamaModelExists }
