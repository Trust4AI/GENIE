import { check } from 'express-validator'

const request = [
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
    check('modelName')
        .optional()
        .isString()
        .isLength({ min: 1, max: 30 })
        .trim()
        .withMessage(
            'model is optional but must be a string with length between 1 and 30 if provided'
        ),
]

export { request }
