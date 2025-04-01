import hapiApollo from '@as-integrations/hapi'
import { apolloServer } from './apollo-server.js'
import { CommsDataSource } from '../graphql/datasources/comms-event.js'
import { MetadataDataSource } from '../graphql/datasources/file-metadata.js'

const graphqlPlugin = {
  plugin: {
    name: 'graphql',
    register: async (server) => {
      await server.register({
        plugin: hapiApollo.default,
        options: {
          apolloServer,
          path: '/graphql',
          context: async (request) => ({
            dataSources: {
              commsEvent: new CommsDataSource({ request }),
              fileMetadata: new MetadataDataSource({ request })
            }
          })
        }
      })
    }
  }
}

export { graphqlPlugin }
