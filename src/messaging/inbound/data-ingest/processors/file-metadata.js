import { UNPROCESSABLE_MESSAGE } from '../../../../constants/error-types.js'

import { createLogger } from '../../../../logging/logger.js'
import { validate } from '../../../../schemas/validate.js'
import { v1, v2 } from '../../../../schemas/file-metadata/index.js'

const logger = createLogger()

const processV1FileMetadata = async (message) => {
  const [validated, errors] = await validate(v1, message)

  if (errors) {
    throw new Error(`Invalid message: ${errors}`, {
      cause: UNPROCESSABLE_MESSAGE
    })
  }

  logger.info(`File metadata message processed successfully, eventId: ${validated.metadata.id}`)
}

const processV2FileMetadata = async (message) => {
  const [validated, errors] = await validate(v2, message)

  if (errors) {
    throw new Error(`Invalid message: ${errors}`, {
      cause: UNPROCESSABLE_MESSAGE
    })
  }

  logger.info(`File metadata message processed successfully, eventId: ${validated.id}`)
}

export { processV1FileMetadata, processV2FileMetadata }
