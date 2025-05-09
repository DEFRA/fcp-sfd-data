import { writeFile } from 'node:fs/promises'
import yaml from 'js-yaml'

const generateOpenapi = async (server) => {
  const openApiJson = await server.inject({
    method: 'GET',
    url: '/documentation.json'
  })
  const openApiYaml = yaml.dump(openApiJson.result)
  await writeFile('./docs/openapi/hapi-swagger-v1.yaml', openApiYaml)
}

export { generateOpenapi }
