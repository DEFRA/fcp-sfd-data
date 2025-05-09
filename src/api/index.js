import path from 'path'
import hapi from '@hapi/hapi'
import Inert from '@hapi/inert'
import Vision from '@hapi/vision'
import hapiSwagger from 'hapi-swagger'

import { config } from '../config/index.js'
import { router } from './router.js'
import { requestLogger } from './common/helpers/request-logger.js'
import { secureContext } from './common/helpers/secure-context/index.js'
import { pulse } from './common/helpers/pulse.js'
import { requestTracing } from './common/helpers/request-tracing.js'
import { setupProxy } from './common/helpers/proxy/setup-proxy.js'

const hapiSwaggerOptions = {
  info: {
    title: 'FCP SFD Data API',
    version: '0.0.1'
  },
  OAS: 'v3.0',
  documentationPath: '/documentation',
  jsonPath: '/documentation.json',
  cors: false,
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'local server'
    }
  ]
}

const createServer = async () => {
  setupProxy()

  const server = hapi.server({
    port: config.get('port'),
    routes: {
      validate: {
        options: {
          abortEarly: false
        }
      },
      files: {
        relativeTo: path.resolve(config.get('root'), '.public')
      },
      security: {
        hsts: {
          maxAge: 31536000,
          includeSubDomains: true,
          preload: false
        },
        xss: 'enabled',
        noSniff: true,
        xframe: true
      }
    },
    router: {
      stripTrailingSlash: true
    }
  })

  await server.register([
    requestLogger,
    requestTracing,
    secureContext,
    pulse,
    router,
    Inert,
    Vision,
    {
      plugin: hapiSwagger,
      options: hapiSwaggerOptions
    }
  ])

  return server
}

export { createServer }
