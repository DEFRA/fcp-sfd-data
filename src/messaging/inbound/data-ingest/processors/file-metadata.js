import { createLogger } from '../../../../logging/logger.js'
import { validate } from '../../../../schemas/validate.js'

import { v1 } from '../../../../schemas/file-metadata/index.js'
import { v1 as dataIngestSchema } from '../../../../schemas/data-ingest/index.js'

import { UnprocessableMessageError } from '../../../../errors/message-errors.js'

const logger = createLogger()

const processV1FileMetadata = async (message) => {
  const [validated, err] = await validate(v1, message)

  if (err) {
    logger.error(`Invalid message: ${err.details.map(d => d.message)}`)

    throw new UnprocessableMessageError('Invalid message', {
      cause: err
    })
  }

  logger.info(`File metadata message processed successfully, eventId: ${validated.metadata.id}`)
}

const processV2FileMetadata = async (message) => {
  const [validated, err] = await validate(dataIngestSchema, message)

  if (err) {
    logger.error(`Invalid message: ${err.details.map(d => d.message)}`)

    throw new UnprocessableMessageError('Invalid message', {
      cause: err
    })
  }

  logger.info(`File metadata message processed successfully, eventId: ${validated.id}`)
}

export { processV1FileMetadata, processV2FileMetadata }
