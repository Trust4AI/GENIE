import express, { Express } from 'express'
import cors from 'cors'
import modelRoutes from './routes/ModelRoutes'
import executorRoutes from './routes/ExecutorRoutes'
import swaggerui from 'swagger-ui-express'
import { swaggerDocs } from './config/swagger'
import './config/loadEnv'

const app: Express = express()
const API_VERSION: string = '/api/v1'
const swaggerUI = swaggerui

app.use(express.json())
app.use(cors())

app.use(
    `${API_VERSION}/docs`,
    swaggerUI.serve,
    swaggerUI.setup(swaggerDocs, { explorer: true })
)
app.use(`${API_VERSION}/models`, modelRoutes)
app.use(`${API_VERSION}/metamorphic-tests`, executorRoutes)

module.exports = app
