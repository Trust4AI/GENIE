import express, { Express } from 'express'
import cors from 'cors'
import modelRouter from './routes/Models'
import './config/loadEnv'

const app: Express = express()
const API_VERSION = '/api/v1'

app.use(express.json())
app.use(cors())

app.use(API_VERSION + '/models', modelRouter)

module.exports = app
