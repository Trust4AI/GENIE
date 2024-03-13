import { check } from 'express-validator'

const request = [
    check('role')
        .isString()
        .isLength({ min: 1, max: 30 })
        .trim()
        .withMessage('role must be a string with length between 1 and 30'),
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
            'model is optional but must be a string with length between 1 and 30 if provided'
        ),
    check('max_length')
        .optional()
        .isInt({ min: 20, max: 200 })
        .withMessage(
            'max_length is optional but must be an integer between 20 and 200 if provided'
        ),
]

export { request }
