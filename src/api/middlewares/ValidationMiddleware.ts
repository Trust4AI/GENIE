import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'

const handleValidation = (req: Request, res: Response, next: NextFunction) => {
    const error = validationResult(req).array()
    if (error.length > 0) {
        res.status(422).send(error)
    } else {
        next()
    }
}

export { handleValidation }
