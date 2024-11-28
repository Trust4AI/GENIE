import express from 'express'
import ExecutorController from '../controllers/ExecutorController'
import * as ExecutorInputValidation from '../controllers/validation/ExecutorInputValidation'
import { handleValidation } from '../middlewares/ValidationMiddleware'
import container from '../config/container'
import { checkEntityExists } from '../middlewares/EntityMiddleware'
import { checkOllamaModelExists } from '../middlewares/ModelMiddleware'

const router = express.Router()
const executorController = new ExecutorController()
const executorBaseService = container.resolve('executorBaseService')

/**
 * @swagger
 * components:
 *   schemas:
 *     GENIEModels:
 *       type: object
 *       properties:
 *         openai:
 *           type: array
 *           items:
 *             type: string
 *         gemini:
 *           type: array
 *           items:
 *             type: string
 *         ollama:
 *           type: object
 *           additionalProperties:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               url:
 *                 type: string
 *     AddModelResponse:
 *       type: object
 *       required:
 *         - category
 *         - id
 *       properties:
 *         category:
 *           type: string
 *           description: The category of the model added.
 *           example: "ollama"
 *         id:
 *           type: string
 *           description: The unique identifier of the model added.
 *           example: "mistral-7b"
 *         name:
 *           type: string
 *           description: The base name of the model in Ollama.
 *           example: "mistral:7b"
 *         url:
 *           type: string
 *           description: The url to use the model.
 *           example: "http://127.0.0.1:11434"
 *       example:
 *         category: "ollama"
 *         id: "mistral-7b"
 *         name: "mistral:7b"
 *         url: "http://127.0.0.1:11434"
 *     UpdateModelResponse:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: string
 *           description: The unique identifier of the model updated.
 *           example: "mistral-7b"
 *         name:
 *           type: string
 *           description: The base name of the model in Ollama.
 *           example: "mistral:7b"
 *         url:
 *           type: string
 *           description: The url to use the model.
 *           example: "http://127.0.0.1:11434"
 *       example:
 *         id: "mistral-7b"
 *         name: "mistral:7b"
 *         url: "http://127.0.0.1:11434"
 *     OllamaModel:
 *       type: object
 *       required:
 *         - name
 *         - model
 *         - modified_at
 *       properties:
 *         name:
 *           type: string
 *           description: The name given to the model in Ollama.
 *           example: "llama3:latest"
 *         model:
 *           type: string
 *           description: The base name of the model in Ollama.
 *           example: "llama3:8b"
 *         modified_at:
 *           type: string
 *           format: date-time
 *           description: The date and time the model was last modified.
 *           example: "2024-08-01T12:15:39.507589+02:00"
 *       example:
 *         name: "llama3:latest"
 *         model: "llama3:8b"
 *         modified_at: "2024-08-01T12:15:39.507589+02:00"
 *     Message:
 *       type: object
 *       required:
 *         - message
 *       properties:
 *         message:
 *           type: string
 *       example:
 *         message: GENIE is working properly!
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
 *         path: "prompt"
 *         location: "body"
 *     AddModelInput:
 *       type: object
 *       required:
 *         - category
 *         - id
 *       properties:
 *         category:
 *           description: The category of the model to add.
 *           type: string
 *           enum: ["ollama", "openai", "gemini"]
 *           example: "ollama"
 *         id:
 *           description: The unique identifier of the model to add.
 *           type: string
 *           example: "mistral-7b"
 *         name:
 *           description: The base name of the model in Ollama.
 *           type: string
 *           example: "mistral:7b"
 *         base_url:
 *           description: The base url to use the model.
 *           type: string
 *           example: "http://127.0.0.1"
 *         port:
 *           description: The port to use the model.
 *           type: integer
 *           example: 11434
 *       example:
 *         category: "ollama"
 *         id: "mistral-7b"
 *         name: "mistral:7b"
 *         base_url: "http://127.0.0.1"
 *         port: 11434
 *     UpdateModelInput:
 *       type: object
 *       required:
 *         - id
 *         - name
 *       properties:
 *         id:
 *           description: The unique identifier of the model to update.
 *           type: string
 *           example: "mistral-7b"
 *         name:
 *           description: The base name of the model in Ollama.
 *           type: string
 *           example: "mistral:7b"
 *         base_url:
 *           description: The base url to use the model.
 *           type: string
 *           example: "http://127.0.0.1"
 *         port:
 *           description: The port to use the model.
 *           type: integer
 *           example: 11434
 *       example:
 *         id: "mistral-7b"
 *         name: "mistral:7b"
 *         base_url: "http://127.0.0.1"
 *         port: 11434
 *     ExecutionInput:
 *       type: object
 *       required:
 *         - model_name
 *         - user_prompt
 *       properties:
 *         model_name:
 *           description: The name of the model to use.
 *           type: string
 *           enum: ["llama3-8b", "llama2-7b", "mistral-7b", "gemma-7b"]
 *           example: "llama3-8b"
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
 *           description: Whether to return the model under test response in list format.
 *           type: boolean
 *           example: true
 *         exclude_bias_references:
 *           description: Whether to exclude bias references to the attribute in the model under test response.
 *           type: boolean
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
 *       example:
 *         model_name: "llama3-8b"
 *         system_prompt: "Respond as if you were NASA's chief engineer."
 *         user_prompt: "How can a Jewish engineer solve complex problems?"
 *         response_max_length: 100
 *         list_format_response: true
 *         exclude_bias_references: true
 *         excluded_text: "Jewish"
 *         format: "text"
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

/**
 * @swagger
 * /models:
 *   get:
 *     summary: Get the list of models configured in GENIE.
 *     tags: [Models]
 *     responses:
 *       200:
 *         description: Successful response.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   post:
 *     summary: Add a new model to GENIE configuration.
 *     tags: [Models]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddModelInput'
 *     responses:
 *       200:
 *         description: Successful response.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AddModelResponse'
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
    .route('/')
    .get(executorController.index)
    .post(ExecutorInputValidation.add, handleValidation, executorController.add)

/**
 * @swagger
 * /models/{id}:
 *   put:
 *     summary: Update a model configuration in GENIE.
 *     tags: [Models]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the model to update.
 *         schema:
 *           type: string
 *           example: "mistral-7b"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateModelInput'
 *     responses:
 *       200:
 *         description: Successful response.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateModelResponse'
 *       404:
 *         description: Model not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
 *   delete:
 *     summary: Remove a model configuration from GENIE.
 *     tags: [Models]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the model to remove.
 *         schema:
 *           type: string
 *           example: "mistral-7b"
 *     responses:
 *       200:
 *         description: Successful response.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/message'
 *       404:
 *         description: Model not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router
    .route('/:id')
    .put(
        checkOllamaModelExists('id'),
        ExecutorInputValidation.update,
        handleValidation,
        executorController.update
    )
    .delete(
        checkEntityExists(executorBaseService, 'id'),
        executorController.remove
    )

/**
 * @swagger
 * /models/details:
 *   get:
 *     summary: Get the list of models configured in GENIE with details.
 *     tags: [Models]
 *     responses:
 *       200:
 *         description: Successful response.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/GENIEModels'
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.route('/details').get(executorController.indexDetails)

/**
 * @swagger
 * /models/ollama:
 *   get:
 *     summary: Get the list of local models available in Ollama.
 *     tags: [Models]
 *     responses:
 *       200:
 *         description: Successful response.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OllamaModel'
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.route('/ollama').get(executorController.indexOllama)

/**
 * @swagger
 * /models/check:
 *   get:
 *     summary: Check if GENIE is working properly.
 *     tags: [Models]
 *     responses:
 *       200:
 *         description: Successful response.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.route('/check').get(executorController.check)

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
        ExecutorInputValidation.execute,
        handleValidation,
        executorController.execute
    )

export default router
