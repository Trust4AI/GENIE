import express from 'express'
import ModelController from '../controllers/ModelController'
import * as RequestInputValidation from '../controllers/validation/RequestInputValidation'
import { handleValidation } from '../middlewares/ValidationMiddleware'

const router = express.Router()
const modelController = new ModelController()

router.route('/check').get(modelController.check)

router
    .route('/request')
    .post(
        RequestInputValidation.request,
        handleValidation,
        modelController.request
    )

export default router
