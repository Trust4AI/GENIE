import config from './config/config'
import './config/loadEnv'

const port: string = config.port

const app = require('./app')

app.listen(port, () => {
    console.info(`App listening on port ${port}`)
    console.info(`Swagger UI available at http://localhost:${port}/api/v1/docs`)
})
