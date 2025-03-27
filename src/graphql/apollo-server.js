import { ApolloServer } from '@apollo/server'
import { ApolloServerPluginLandingPageDisabled } from '@apollo/server/plugin/disabled'
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default'
import { PRODUCTION } from '../constants/environments.js'
import resolvers from './resolvers/index.js'
import typeDefs from './schema/index.js'

let plugins = []

if (process.env.ENVIRONMENT_CODE === PRODUCTION) {
  plugins = [ApolloServerPluginLandingPageDisabled()]
} else {
  plugins = [ApolloServerPluginLandingPageLocalDefault({ embed: true })]
}

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  plugins
})

export { apolloServer }
