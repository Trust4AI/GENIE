import express from 'express'
import ExecutorController from '../controllers/ExecutorController'
import * as ExecutorInputValidation from '../controllers/validation/ExecutorInputValidation'
import { handleValidation } from '../middlewares/ValidationMiddleware'
import container from '../config/container'
import { checkEntityExists } from '../middlewares/EntityMiddleware'

const router = express.Router()
const executorController = new ExecutorController()
const executorBaseService = container.resolve('executorBaseService')

/**
 * @swagger
 * components:
 *   schemas:
 *     Message:
 *       type: object
 *       required:
 *         - message
 *       properties:
 *         message:
 *           type: string
 *       example:
 *         message: Executor component generator is working properly!
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
 *           description: The type of the error
 *           type: string
 *           example: "field"
 *         value:
 *           description: The value of the field
 *           type: string
 *           example: ""
 *         msg:
 *           description: The error message
 *           type: string
 *           example: "user_prompt must be a string with length greater than 1"
 *         path:
 *           description: The name of the field
 *           type: string
 *           example: "user_prompt"
 *         location:
 *           description: The location of the error
 *           type: string
 *           example: "body"
 *       example:
 *         type: "field"
 *         value: ""
 *         msg: "user_prompt must be a string with length greater than 1"
 *         path: "prompt"
 *         location: "body"
 *     ExecutionInput:
 *       type: object
 *       required:
 *         - model_name
 *         - user_prompt
 *       properties:
 *         model_name:
 *           description: The name of the model to use
 *           type: string
 *           enum: ["llama3-8b", "llama2-7b", "mistral-7b", "gemma-7b"]
 *           example: "llama3-8b"
 *         system_prompt:
 *           description: The system prompt to execute on the model
 *           type: string
 *           minLength: 1
 *           example: "Respond as if you were NASA's chief engineer."
 *         user_prompt:
 *           description: The user prompt to execute on the model
 *           type: string
 *           minLength: 1
 *           example: "How can a Jewish engineer solve complex problems?"
 *         response_max_length:
 *           description: The maximum length of the response in words, -1 for no limit
 *           type: integer
 *           minimum: 1
 *           maximum: 2000
 *           enum: [-1]
 *           example: 100
 *         list_format_response:
 *           description: Whether to return the response in list format
 *           type: boolean
 *           example: true
 *         exclude_bias_references:
 *           description: Whether to exclude bias references from the response
 *           type: boolean
 *           example: true
 *         excluded_text:
 *           description: The text to exclude from the response
 *           type: string
 *           minLength: 1
 *           maxLength: 30
 *           example: "Jewish"
 *       example:
 *         model_name: "llama3-8b"
 *         system_prompt: "Respond as if you were NASA's chief engineer."
 *         user_prompt: "How can a Jewish engineer solve complex problems?"
 *         response_max_length: 100
 *         list_format_response: true
 *         exclude_bias_references: true
 *         excluded_text: "Jewish"
 *     Response:
 *       type: object
 *       required:
 *         - response
 *       properties:
 *         response:
 *           type: string
 *           description: The response from the model
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
    .get(executorController.index)
    .post(ExecutorInputValidation.add, handleValidation, executorController.add)

router
    .route('/:id')
    .put(
        checkEntityExists(executorBaseService, 'id'),
        ExecutorInputValidation.update,
        handleValidation,
        executorController.update
    )
    .delete(
        checkEntityExists(executorBaseService, 'id'),
        executorController.remove
    )

router.route('/ollama').get(executorController.indexOllama)

/**
 * @swagger
 * /check:
 *   get:
 *     summary: Check if the executor component API is working properly
 *     tags: [Models]
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       500:
 *         description: Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.route('/check').get(executorController.check)

/**
 * @swagger
 * /execute:
 *   post:
 *     summary: Send a prompt under a specific model to generate a response
 *     tags: [Models]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ExecutionInput'
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Response'
 *       422:
 *         description: Validation Error
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ValidationError'
 *       500:
 *         description: Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router
    .route('/execute')
    .post(
        ExecutorInputValidation.execute,
        handleValidation,
        executorController.execute
    )

export default router
