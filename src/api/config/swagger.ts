import swaggerjsdoc from 'swagger-jsdoc'
import yaml from 'yaml'
import fs from 'fs'

const port = process.env.PORT || 8081
const swaggerJsDoc = swaggerjsdoc

const swaggerOptions = {
    definition: {
        openapi: '3.1.0',
        info: {
            version: '1.0.0',
            title: 'Executor Component - API',
            description: 'Component in charge of executing prompts on LLMs',
            contact: {
                name: 'Trust4AI Team',
                email: '',
                url: 'https://trust4ai.github.io/trust4ai/',
            },
            license: {
                name: 'GNU General Public License v3.0',
                url: 'https://github.com/Trust4AI/executor-component/blob/main/LICENSE',
            },
        },
        servers: [
            {
                url: 'http://localhost:' + port + '/api/v1/models/',
            },
        ],
    },
    apis: ['./api/routes/ModelRoutes.ts'],
}

const swaggerDocs = swaggerJsDoc(swaggerOptions)

const yamlString: string = yaml.stringify(swaggerDocs, {})
fs.writeFileSync('../docs/openapi/spec.yaml', yamlString)

export { swaggerDocs }
