import { createLogger } from '../../../../logging/logger.js'
import { validate } from '../../../../schemas/validate.js'

import { v1 } from '../../../../schemas/comms/index.js'
import { v1 as dataIngestSchema } from '../../../../schemas/data-ingest/index.js'

import UnprocessableMessageError from '../../../../errors/unprocesable-message.js'

const logger = createLogger()

const processV1CommsData = async (message) => {
  const [validated, errors] = await validate(v1, message)

  if (errors) {
    logger.error(`Invalid message: ${errors.details.map(d => d.message)}`)

    throw new UnprocessableMessageError('Invalid message', {
      cause: errors
    })
  }

  logger.info(`Comms message processed successfully, eventId: ${validated.commsMessage.id}`)
}

const processV2CommsData = async (message) => {
  const [validated, errors] = await validate(dataIngestSchema, message)

  if (errors) {
    logger.error(`Invalid message: ${errors.details.map(d => d.message)}`)

    throw new UnprocessableMessageError('Invalid message', {
      cause: errors
    })
  }

  logger.info(`Comms message processed successfully, eventId: ${validated.id}`)
}

export { processV1CommsData, processV2CommsData }
