import convict from 'convict'

import { serverConfig } from './server.js'
import { awsConfig } from './aws.js'
import { mongoConfig } from './mongo.js'
import { messagingConfig } from './messaging.js'

const config = convict({
  ...serverConfig,
  ...awsConfig,
  ...mongoConfig,
  ...messagingConfig
})

config.validate({ allowed: 'strict' })

export { config }
