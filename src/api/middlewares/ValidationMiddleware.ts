import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'

const handleValidation = (req: Request, res: Response, next: NextFunction) => {
    const err = validationResult(req).array()
    if (err.length > 0) {
        res.status(422).send(err)
    } else {
        next()
    }
}

export { handleValidation }
