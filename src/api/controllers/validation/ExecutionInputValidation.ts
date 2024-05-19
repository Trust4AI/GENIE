import { check } from 'express-validator'

const execute = [
    check('role')
        .optional()
        .isString()
        .isLength({ min: 1, max: 30 })
        .trim()
        .withMessage(
            'role is optional but must be a string with length between 1 and 30 if provided'
        ),
    check('prompt')
        .isString()
        .isLength({ min: 1, max: 2000 })
        .trim()
        .withMessage('prompt must be a string with length between 1 and 2000'),
    check('model_name')
        .optional()
        .isString()
        .isLength({ min: 1, max: 30 })
        .trim()
        .withMessage(
            'modelName is optional but must be a string with length between 1 and 30 if provided'
        ),
    check('excluded_text')
        .optional()
        .isString()
        .isLength({ min: 1, max: 30 })
        .trim()
        .withMessage(
            'excludedText is optional but must be a string with length between 1 and 30 if provided'
        ),
]

export { execute }
