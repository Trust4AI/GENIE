import { check } from 'express-validator'
import { getModelIds } from '../../utils/modelUtils'

const add = [
    check('id')
        .isString()
        .isLength({ min: 1, max: 30 })
        .trim()
        .withMessage(
            'id must be a string with length greater than 1 and less than 30'
        ),
    check('name')
        .isString()
        .isLength({ min: 1, max: 30 })
        .trim()
        .withMessage(
            'name must be a string with length greater than 1 and less than 30'
        ),
    check('port')
        .optional()
        .isInt()
        .withMessage('port must be an integer')
        .toInt(),
]

const update = [
    check('name')
        .isString()
        .isLength({ min: 1, max: 30 })
        .trim()
        .withMessage(
            'name must be a string with length greater than 1 and less than 30'
        ),
    check('port')
        .optional()
        .isInt()
        .withMessage('port must be an integer')
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
                    `model_name must be one of the following values: ${modelIds.join(
                        ', '
                    )}`
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
        .custom(
            (value) =>
                value === -1 ||
                (Number.isInteger(value) && value >= 1 && value <= 2000)
        )
        .withMessage(
            'response_max_length is optional but must be an integer between 1 and 2000 or -1 if provided'
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
]

export { add, update, execute }
