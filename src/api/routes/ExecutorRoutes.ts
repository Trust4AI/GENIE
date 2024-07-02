import express from 'express'
import ExecutorController from '../controllers/ExecutorController'
import * as ExecutionInputValidation from '../controllers/validation/ExecutionInputValidation'
import { handleValidation } from '../middlewares/ValidationMiddleware'

const router = express.Router()
const executorController = new ExecutorController()

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
 *           example: "prompt must be a string with length between 1 and 2000"
 *         path:
 *           description: The name of the field
 *           type: string
 *           example: "prompt"
 *         location:
 *           description: The location of the error
 *           type: string
 *           example: "body"
 *       example:
 *         type: "field"
 *         value: ""
 *         msg: "prompt must be a string with length between 1 and 2000"
 *         path: "prompt"
 *         location: "body"
 *     ExecutionInput:
 *       type: object
 *       required:
 *         - prompt
 *       properties:
 *         role:
 *           description: The role used to generate the prompt
 *           type: string
 *           minLength: 1
 *           maxLength: 30
 *           example: "Engineer"
 *         prompt:
 *           description: The prompt to execute on the model
 *           type: string
 *           minLength: 1
 *           maxLength: 2000
 *           example: "How can engineers solve complex problems?"
 *         modelName:
 *           description: The name of the model to use
 *           type: string
 *           minLength: 1
 *           maxLength: 30
 *           example: "gemma"
 *       example:
 *         role: "Engineer"
 *         prompt: "How can engineers solve complex problems?"
 *         modelName: "gemma"
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
 *         reponse: "Interactive and hands-on activities that encourage exploration and problem-solving. Engaging stories and characters that capture their imagination. Differentiated instruction to meet individual learning styles. Collaboration and teamwork to foster a sense of community and shared learning."
 */

/**
 * @swagger
 * tags:
 *  name: Models
 */

/**
 * @swagger
 * /check:
 *   get:
 *     summary: Check if the Executor component API is working
 *     tags: [Models]
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *             example:
 *               message: Executor component is working properly!
 *       500:
 *         description: Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: Internal Server Error
 */
router.route('/check').get(executorController.check)

/**
 * @swagger
 * /execute:
 *   post:
 *     summary: Send a prompt under a specific model
 *     tags: [Models]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ExecutionInput'
 *           example:
 *             role: "Engineer"
 *             prompt: "How can engineers solve complex problems?"
 *             modelName: "gemma"
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Response'
 *             example:
 *               response: "Interactive and hands-on activities that encourage exploration and problem-solving. Engaging stories and characters that capture their imagination. Differentiated instruction to meet individual learning styles. Collaboration and teamwork to foster a sense of community and shared learning."
 *       422:
 *         description: Validation Error
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ValidationError'
 *             example:
 *               - type: "field"
 *                 value: ""
 *                 msg: "prompt must be a string with length between 1 and 2000"
 *                 path: "prompt"
 *                 location: "body"
 *               - type: "field"
 *                 value: ""
 *                 msg: "modelName is optional but must be a string with length between 1 and 30 if provided"
 *                 path: "modelName"
 *                 location: "body"
 *       500:
 *         description: Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: Internal Server Error
 */
router
    .route('/execute')
    .post(
        ExecutionInputValidation.execute,
        handleValidation,
        executorController.execute
    )

export default router
