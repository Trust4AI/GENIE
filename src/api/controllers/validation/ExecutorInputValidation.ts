import { check } from 'express-validator'
import { getModelIds } from '../../utils/modelUtils'
import { getOllamaModels } from '../../utils/ollamaUtils'

const ollamaBaseUrl = process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434'

const add = [
    check('id')
        .isString()
        .trim()
        .custom(async (value) => {
            const modelIds = await getModelIds()
            if (modelIds.includes(value)) {
                return Promise.reject(
                    new Error(
                        `id must be unique and not one of the following values: [${modelIds.join(
                            `, `
                        )}]. Please use a different id.`
                    )
                )
            }
        })
        .isLength({ min: 1, max: 30 })
        .withMessage(
            'id must be a string with length greater than 1 and less than 30'
        ),
    check('name')
        .isString()
        .trim()
        .custom(async (value) => {
            const ollamaModels = await getOllamaModels(ollamaBaseUrl)
            if (!ollamaModels.map((model: any) => model.name).includes(value)) {
                return Promise.reject(
                    new Error(
                        `name must be one of the following values: [${ollamaModels
                            .map((model: any) => model.name)
                            .join(
                                ', '
                            )}]. If you want to use other model, pull it from Ollama first.`
                    )
                )
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
        .custom(async (value) => {
            const ollamaModels = await getOllamaModels(ollamaBaseUrl)
            if (!ollamaModels.map((model: any) => model.name).includes(value)) {
                return Promise.reject(
                    new Error(
                        `name must be one of the following values: [${ollamaModels
                            .map((model: any) => model.name)
                            .join(
                                ', '
                            )}]. If you want to use other model, pull it from Ollama first.`
                    )
                )
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

const execute = [
    check('model_name')
        .isString()
        .trim()
        .custom(async (value) => {
            const modelIds = await getModelIds()
            if (!modelIds.includes(value)) {
                return Promise.reject(
                    new Error(
                        `model_name must be one of the following values: [${modelIds.join(
                            ', '
                        )}]`
                    )
                )
            }
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
    check('exclude_bias_references')
        .optional()
        .isBoolean()
        .withMessage(
            'exclude_bias_references is optional but must be a boolean if provided'
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
]

export { add, update, execute }
