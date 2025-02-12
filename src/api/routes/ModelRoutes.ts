import express from 'express'
import ModelController from '../controllers/ModelController'
import * as ModelInputValidation from '../controllers/validation/ModelInputValidation'
import { handleValidation } from '../middlewares/ValidationMiddleware'
import container from '../config/container'
import { checkEntityExists } from '../middlewares/EntityMiddleware'
import { checkOllamaModelExists } from '../middlewares/ModelMiddleware'

const router = express.Router()
const modelController = new ModelController()
const modelBaseService = container.resolve('modelBaseService')

/**
 * @swagger
 * components:
 *   schemas:
 *     ModelMessage:
 *       type: object
 *       required:
 *         - message
 *       properties:
 *         message:
 *           type: string
 *       example:
 *         message: The model routes are working properly!
 *     Error:
 *       type: object
 *       required:
 *         - error
 *       properties:
 *         error:
 *           type: string
 *       example:
 *         error: Internal Server Error
 *     ValidationError:
 *       type: object
 *       required:
 *         - type
 *         - value
 *         - msg
 *         - path
 *         - location
 *       properties:
 *         type:
 *           description: The type of the error.
 *           type: string
 *           example: "field"
 *         value:
 *           description: The value of the field that caused the error.
 *           type: string
 *           example: ""
 *         msg:
 *           description: The error message.
 *           type: string
 *           example: "user_prompt must be a string with length greater than 1"
 *         path:
 *           description: The name of the field that caused the error.
 *           type: string
 *           example: "user_prompt"
 *         location:
 *           description: The location of the error.
 *           type: string
 *           example: "body"
 *       example:
 *         type: "field"
 *         value: ""
 *         msg: "user_prompt must be a string with length greater than 1"
 *         path: "user_prompt"
 *         location: "body"
 *     ExecutionInput:
 *       type: object
 *       required:
 *         - model_name
 *         - user_prompt
 *       properties:
 *         model_name:
 *           description: The name of the model to use.
 *           type: string
 *           enum: ["gemini-1.0-pro", "gemini-1.5-flash", "gemini-1.5-flash-8b", "gemini-2.0-flash-exp"]
 *           example: "gemini-1.5-flash"
 *         system_prompt:
 *           description: The system prompt to execute on the model.
 *           type: string
 *           minLength: 1
 *           example: "Respond as if you were NASA's chief engineer."
 *         user_prompt:
 *           description: The user prompt to execute on the model.
 *           type: string
 *           minLength: 1
 *           example: "How can a Jewish engineer solve complex problems?"
 *         response_max_length:
 *           description: The maximum length of the response (in words).
 *           type: integer
 *           minimum: 1
 *           maximum: 2000
 *           example: 100
 *         list_format_response:
 *           description: Determines whether the response of the model should be returned as a structured list of points.
 *           type: boolean
 *           default: false
 *           example: true
 *         excluded_text:
 *           description: The text to exclude from the response of the model.
 *           type: string
 *           minLength: 1
 *           maxLength: 30
 *           example: "Jewish"
 *         format:
 *           description: The format of the response to return.
 *           type: string
 *           enum: ["text", "json"]
 *           example: "text"
 *         temperature:
 *           description: The temperature to use for the response generation.
 *           type: number
 *           minimum: 0.0
 *           maximum: 1.0
 *           default: 0.5
 *           example: 0.5
 *       example:
 *         model_name: "gemini-1.5-flash"
 *         system_prompt: "Respond as if you were NASA's chief engineer."
 *         user_prompt: "How can a Jewish engineer solve complex problems?"
 *         response_max_length: 100
 *         list_format_response: true
 *         excluded_text: "Jewish"
 *         format: "text"
 *         temperature: 0.5
 *     Response:
 *       type: object
 *       required:
 *         - response
 *       properties:
 *         response:
 *           type: string
 *           description: The response from the model.
 *           example: "Interactive and hands-on activities that encourage exploration and problem-solving. Engaging stories and characters that capture their imagination. Differentiated instruction to meet individual learning styles. Collaboration and teamwork to foster a sense of community and shared learning."
 *       example:
 *         response: "Interactive and hands-on activities that encourage exploration and problem-solving. Engaging stories and characters that capture their imagination. Differentiated instruction to meet individual learning styles. Collaboration and teamwork to foster a sense of community and shared learning."
 */

/**
 * @swagger
 * tags:
 *  name: Models
 */

router
    .route('/')
    .get(modelController.index)
    .post(ModelInputValidation.add, handleValidation, modelController.add)

router
    .route('/:id')
    .put(
        checkOllamaModelExists('id'),
        ModelInputValidation.update,
        handleValidation,
        modelController.update
    )
    .delete(checkEntityExists(modelBaseService, 'id'), modelController.remove)

router.route('/details').get(modelController.indexDetails)

router.route('/ollama').get(modelController.indexOllama)

/**
 * @swagger
 * /models/check:
 *   get:
 *     summary: Check if model routes are working properly.
 *     tags: [Models]
 *     responses:
 *       200:
 *         description: Successful response.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ModelMessage'
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.route('/check').get(modelController.check)

/**
 * @swagger
 * /models/execute:
 *   post:
 *     summary: Send a prompt under a specific model to generate a response.
 *     tags: [Models]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ExecutionInput'
 *     responses:
 *       200:
 *         description: Successful response.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Response'
 *       422:
 *         description: Validation error.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ValidationError'
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router
    .route('/execute')
    .post(
        ModelInputValidation.execute,
        handleValidation,
        modelController.execute
    )

export default router
