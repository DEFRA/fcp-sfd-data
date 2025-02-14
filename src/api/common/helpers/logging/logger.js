import { pino } from 'pino'

import { loggerOptions } from './logger-options.js'

const createLogger = () => {
  return pino(loggerOptions)
}

export { createLogger }
