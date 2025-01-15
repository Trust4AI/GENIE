import swaggerjsdoc, { Options } from 'swagger-jsdoc'
import yaml from 'yaml'
import fs from 'fs'
import config from './config'

const port: string = config.port
const swaggerJsDoc = swaggerjsdoc

const swaggerOptions: Options = {
    definition: {
        openapi: '3.1.0',
        info: {
            version: '1.0.0',
            title: 'GENIE: Natural Language Enquiry Executor',
            description:
                'GENIE facilitates the deployment and execution of Large Language Models (LLMs).',
            contact: {
                name: 'Trust4AI Team',
                email: '',
                url: 'https://trust4ai.github.io/trust4ai/',
            },
            license: {
                name: 'GNU General Public License v3.0',
                url: 'https://github.com/Trust4AI/GENIE/blob/main/LICENSE',
            },
        },
        servers: [
            {
                url: `http://localhost:${port}/api/v1/`,
            },
        ],
    },
    apis: ['./api/routes/ExecutorRoutes.ts'],
}

const swaggerDocs = swaggerJsDoc(swaggerOptions)

const yamlString: string = yaml.stringify(swaggerDocs, {})
fs.writeFileSync('../docs/openapi/spec.yaml', yamlString)

export { swaggerDocs }
