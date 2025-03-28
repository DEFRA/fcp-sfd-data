import hapiApollo from '@as-integrations/hapi'
import { apolloServer } from './apollo-server.js'

const graphqlPlugin = {
  plugin: {
    name: 'graphql',
    register: async (server) => {
      await server.register({
        plugin: hapiApollo.default,
        options: {
          apolloServer,
          path: '/graphql'
        }
      })
    }
  }
}

export { graphqlPlugin }
