import express, { Express } from 'express'
import cors from 'cors'
import executorRoutes from './routes/ExecutorRoutes'
import swaggerui from 'swagger-ui-express'
import { swaggerDocs } from './config/swagger'
import './config/loadEnv'

const app: Express = express()
const API_VERSION = '/api/v1'
const swaggerUI = swaggerui

app.use(express.json())
app.use(cors())

app.use(
    API_VERSION + '/models/docs',
    swaggerUI.serve,
    swaggerUI.setup(swaggerDocs, { explorer: true })
)
app.use(API_VERSION + '/models', executorRoutes)

module.exports = app
