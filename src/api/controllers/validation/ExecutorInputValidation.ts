import { check } from 'express-validator'
import { getModelIds } from '../../utils/modelUtils'

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
    check('prompt_1')
        .isString()
        .isLength({ min: 1 })
        .trim()
        .withMessage('prompt_1 must be a string with length greater than 1'),
    check('prompt_2')
        .isString()
        .isLength({ min: 1 })
        .trim()
        .withMessage('prompt_2 must be a string with length greater than 1'),
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
    check('numeric_format_response')
        .optional()
        .isBoolean()
        .withMessage(
            'numeric_format_response is optional but must be a boolean if provided'
        ),
    check('yes_no_format_response')
        .optional()
        .isBoolean()
        .withMessage(
            'yes_no_format_response is optional but must be a boolean if provided'
        ),
    check('multiple_choice_format_response')
        .optional()
        .isBoolean()
        .withMessage(
            'multiple_choice_format_response is optional but must be a boolean if provided'
        ),
    check('completion_format_response')
        .optional()
        .isBoolean()
        .withMessage(
            'completion_format_response is optional but must be a boolean if provided'
        ),
    check('excluded_text')
        .optional()
        .isArray({ min: 1 })
        .withMessage(
            'excluded_text must be an array with at least one string if provided'
        )
        .custom((value: any[]) => {
            if (
                !Array.isArray(value) ||
                !value.every(
                    (item) =>
                        typeof item === 'string' &&
                        item.length >= 1 &&
                        item.length <= 30
                )
            ) {
                throw new Error(
                    'excluded_text must be an array (if provided) of strings, each with a length between 1 and 30'
                )
            }
            return true
        }),
    check('temperature')
        .optional()
        .isFloat({ min: 0.0, max: 1.0 })
        .withMessage(
            'temperature is optional but must be a float between 0.0 and 1.0 if provided'
        ),
    check('type')
        .optional()
        .isString()
        .trim()
        .isIn(['comparison', 'consistency'])
        .withMessage(
            'type is optional but must be one of the following values: [comparison, consistency] if provided'
        ),
]

export { execute }
