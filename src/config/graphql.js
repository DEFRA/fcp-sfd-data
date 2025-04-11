import convict from 'convict'
import { DEVELOPMENT, TEST } from '../constants/environments.js'

export const graphqlConfig = convict({
  enableIntrospection: {
    doc: 'allow introspection',
    format: Boolean,
    default: process.env.ENVIRONMENT_CODE === TEST || process.env.ENVIRONMENT_CODE === DEVELOPMENT
  }
})
