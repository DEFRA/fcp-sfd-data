import hapiPino from 'hapi-pino'

import { loggerOptions } from '~/src/api/common/helpers/logging/logger-options.js'

const requestLogger = {
  plugin: hapiPino,
  options: loggerOptions
}

export { requestLogger }
