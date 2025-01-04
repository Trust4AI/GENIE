import { check } from 'express-validator'
import {
    getModelCategories,
    getOllamaModelConfig,
    getModelIds,
    getUsedOllaModels,
} from '../../utils/modelUtils'
import { getOllamaModels } from '../../utils/ollamaUtils'

const ollamaBaseUrl: string =
    process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434'

const add = [
    check('category')
        .isString()
        .trim()
        .isIn(getModelCategories())
        .withMessage(
            'category must be one of the following values: [' +
                getModelCategories().join(', ') +
                '].'
        ),
    check('id')
        .isString()
        .trim()
        .custom((value: string): boolean => {
            const modelIds: string[] = getModelIds()
            if (modelIds.includes(value)) {
                throw new Error(
                    `id must be unique and not one of the following values: [${modelIds.join(
                        `, `
                    )}]. Please use a different id.`
                )
            }
            return true
        })
        .isLength({ min: 1, max: 30 })
        .withMessage(
            'id must be a string with length greater than 1 and less than 30'
        ),
    check('name')
        .if((value, { req }) => req.body.category === 'ollama')
        .isString()
        .trim()
        .custom(async (value: string, { req }) => {
            if (req.body.category === 'ollama') {
                const usedOllamaModels: string[] = getUsedOllaModels().map(
                    (model: any) => model.name
                )
                let installedOllamaModels: string[] = await getOllamaModels(
                    ollamaBaseUrl
                ).then((models: any) => models.map((model: any) => model.name))
                const validOllamaModels: string[] =
                    installedOllamaModels.filter(
                        (model: string) => !usedOllamaModels.includes(model)
                    )
                if (!validOllamaModels.includes(value)) {
                    throw new Error(
                        `name can be one of the following values: [${validOllamaModels.join(
                            ', '
                        )}]. If you want to use other model, pull it from Ollama first.`
                    )
                }
                return true
            }
        }),
    check('base_url')
        .optional()
        .isString()
        .isLength({ min: 1 })
        .trim()
        .withMessage(
            'base_url must be a string with length greater than 1 if provided'
        ),
    check('port')
        .optional()
        .isInt()
        .withMessage('port must be an integer if provided')
        .toInt(),
]

const update = [
    check('name')
        .isString()
        .trim()
        .custom(async (value: string, { req }) => {
            const usedOllamaModels: string[] = getUsedOllaModels().map(
                (model: any) => model.name
            )
            const installedOllamaModels: string[] = await getOllamaModels(
                ollamaBaseUrl
            ).then((models: any) => models.map((model: any) => model.name))

            let validOllamaModels: string[] = installedOllamaModels.filter(
                (model: string) => !usedOllamaModels.includes(model)
            )
            const id: string = req.params?.id
            const currentModel = getOllamaModelConfig(id)
            if (currentModel) {
                validOllamaModels = [...validOllamaModels, currentModel.name]
            }

            if (!validOllamaModels.includes(value)) {
                throw new Error(
                    `name must be one of the following values: [${validOllamaModels.join(
                        ', '
                    )}].`
                )
            }
            return true
        }),
    check('base_url')
        .optional()
        .isString()
        .isLength({ min: 1 })
        .trim()
        .withMessage(
            'base_url must be a string with length greater than 1 if provided'
        ),
    check('port')
        .optional()
        .isInt()
        .withMessage('port must be an integer if provided')
        .toInt(),
]

const execute = [
    check('model_name')
        .isString()
        .trim()
        .custom((value: string): boolean => {
            const modelIds: string[] = getModelIds()
            if (!modelIds.includes(value)) {
                throw new Error(
                    `model_name must be one of the following values: [${modelIds.join(
                        ', '
                    )}]`
                )
            }
            return true
        }),
    check('system_prompt')
        .optional()
        .isString()
        .isLength({ min: 1 })
        .trim()
        .withMessage(
            'system_prompt is optional but must be a string with length greater than 1 if provided'
        ),
    check('user_prompt')
        .isString()
        .isLength({ min: 1 })
        .trim()
        .withMessage('user_prompt must be a string with length greater than 1'),
    check('response_max_length')
        .optional()
        .isInt({ min: 1, max: 2000 })
        .withMessage(
            'response_max_length is optional but must be an integer between 1 and 2000 if provided'
        ),
    check('list_format_response')
        .optional()
        .isBoolean()
        .withMessage(
            'list_format_response is optional but must be a boolean if provided'
        ),
    check('excluded_text')
        .optional()
        .isString()
        .isLength({ min: 1, max: 30 })
        .trim()
        .withMessage(
            'excluded_text is optional but must be a string with length between 1 and 30 if provided'
        ),
    check('format')
        .optional()
        .isString()
        .trim()
        .isIn(['json', 'text'])
        .withMessage(
            'format is optional but must be one of the following values: [json, text] if provided'
        ),
    check('temperature')
        .optional()
        .isFloat({ min: 0.0, max: 1.0 })
        .withMessage(
            'temperature is optional but must be a float between 0.0 and 1.0 if provided'
        ),
]

export { add, update, execute }
