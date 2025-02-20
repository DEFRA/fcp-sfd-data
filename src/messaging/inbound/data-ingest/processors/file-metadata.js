import { UNPROCESSABLE_MESSAGE } from '../../../../constants/error-types.js'

import { createLogger } from '../../../../logging/logger.js'
import { validate } from '../../../../schemas/validate.js'

import { v1 } from '../../../../schemas/file-metadata/index.js'
import { v1 as dataIngestSchema } from '../../../../schemas/data-ingest/index.js'

const logger = createLogger()

const processV1FileMetadata = async (message) => {
  const [validated, errors] = await validate(v1, message)

  if (errors) {
    logger.error(`Invalid message: ${errors}`)

    throw new Error('Invalid message', {
      cause: UNPROCESSABLE_MESSAGE
    })
  }

  logger.info(`File metadata message processed successfully, eventId: ${validated.metadata.id}`)
}

const processV2FileMetadata = async (message) => {
  const [validated, errors] = await validate(dataIngestSchema, message)

  if (errors) {
    logger.error(`Invalid message: ${errors}`)

    throw new Error('Invalid message', {
      cause: UNPROCESSABLE_MESSAGE
    })
  }

  logger.info(`File metadata message processed successfully, eventId: ${validated.id}`)
}

export { processV1FileMetadata, processV2FileMetadata }
