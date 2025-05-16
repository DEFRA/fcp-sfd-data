import { writeFile } from 'node:fs/promises'
import yaml from 'js-yaml'

import { createLogger } from '../../../logging/logger.js'

const logger = createLogger()

const generateOpenapi = async (server, path = './docs/openapi/v1.yaml') => {
  try {
    const openApiJson = await server.inject({
      method: 'GET',
      url: '/documentation.json'
    })

    const openApiYaml = yaml.dump(openApiJson.result)
    await writeFile(path, openApiYaml)
    logger.info(`OpenAPI documentation generated successfully at ${path}`)

    return true
  } catch (error) {
    logger.error('Failed to generate OpenAPI documentation:', error)
    throw error
  }
}

export { generateOpenapi }
