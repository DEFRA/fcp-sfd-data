import { createLogger } from '~/src/api/common/helpers/logging/logger.js'

const logger = createLogger()

export function failAction(_request, _h, error) {
  logger.warn(error, error?.message)
  throw error
}
