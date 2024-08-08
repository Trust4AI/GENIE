import './config/loadEnv'

const port: string = process.env.PORT || '8081'

const app = require('./app')

app.listen(port, () => {
    console.info(`App listening on port ${port}`)
    console.info(`Swagger UI available at http://localhost:${port}/api/v1/docs`)
})
