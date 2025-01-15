import { getUsedOllaModels } from '../utils/modelUtils'

const checkOllamaModelExists =
    (idPathParamName: string) => (req: any, res: any, next: any) => {
        const id = req.params[idPathParamName]

        const ollamaModelIds: string[] = getUsedOllaModels().map(
            (model: any) => model.id
        )

        if (!ollamaModelIds.includes(id)) {
            return res.status(404).send({
                error: `Model with id ${id} not found in Ollama configuration. Please provide a id from the following values: [${ollamaModelIds.join(
                    ', '
                )}].`,
            })
        }

        return next()
    }

export { checkOllamaModelExists }
