import convict from 'convict'
import environments from '../constants/environments.js'

export const graphqlConfig = convict({
  enableIntrospection: {
    doc: 'allow introspection',
    format: Boolean,
    default: process.env.ENVIRONMENT_CODE === environments.TEST || process.env.ENVIRONMENT_CODE === environments.DEVELOPMENT
  }
})
