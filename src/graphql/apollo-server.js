import { ApolloServer } from '@apollo/server'
import { ApolloServerPluginLandingPageDisabled } from '@apollo/server/plugin/disabled'
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default'
import { DEVELOPMENT, TEST } from '../constants/environments.js'
// import { config } from '../config/index.js'
// import { CommsEventDataSource } from './datasources/comms-event.js'
import resolvers from './resolvers/index.js'
import typeDefs from './schema/index.js'
// import { isLowerEnv } from '../utils/is-lower-env.js'

let plugins = []

if (process.env.ENVIRONMENT_CODE === DEVELOPMENT || process.env.ENVIRONMENT_CODE === TEST) {
  plugins = [ApolloServerPluginLandingPageLocalDefault({ embed: true })]
} else {
  plugins = [ApolloServerPluginLandingPageDisabled()]
}

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  plugins
})

export { apolloServer }
