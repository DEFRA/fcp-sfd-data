import { config } from '../../../config/index.js'
import { createServer } from '../../index.js'
import { createLogger } from '../../../logging/logger.js'
import { apolloServer } from '../../../graphql/apollo-server.js'
import { CommsDataSource } from '../../../graphql/datasources/comms-event.js'
import hapiApollo from '@as-integrations/hapi'

const startServer = async () => {
  let server

  try {
    await apolloServer.start()
    server = await createServer()

    await server.register({
      plugin: hapiApollo.default,
      options: {
        apolloServer,
        path: '/graphql',
        context: async (request) => ({
          dataSources: {
            commsDB: new CommsDataSource({ request })
          }
        })
      }
    })

    await server.start()

    server.logger.info('Server started successfully')
    server.logger.info(
      `Access your backend on http://localhost:${config.get('port')}`
    )
  } catch (error) {
    const logger = createLogger()
    logger.info('Server failed to start :(')
    logger.error(error)
  }

  return server
}

export { startServer }
