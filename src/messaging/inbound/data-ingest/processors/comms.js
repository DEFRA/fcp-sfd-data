import { createLogger } from '../../../../logging/logger.js'
import { validate } from '../../../../schemas/validate.js'
import { persistCommsNotification } from '../../../../repos/comms-message.js'

import { v1 } from '../../../../schemas/comms/index.js'
import { v1 as dataIngestSchema } from '../../../../schemas/data-ingest/index.js'

import { UnprocessableMessageError } from '../../../../errors/message-errors.js'

const logger = createLogger()

const processV1CommsData = async (message) => {
  const [validated, err] = await validate(v1, message)

  if (err) {
    logger.error(`Invalid message: ${err.details.map(d => d.message)}`)

    throw new UnprocessableMessageError('Invalid message', {
      cause: err
    })
  }

  await persistCommsNotification(validated)
  logger.info(`Comms message processed successfully, eventId: ${validated.commsMessage.id}`)
}

const processV2CommsData = async (message) => {
  const [validated, err] = await validate(dataIngestSchema, message)

  if (err) {
    logger.error(`Invalid message: ${err.details.map(d => d.message)}`)

    throw new UnprocessableMessageError('Invalid message', {
      cause: err
    })
  }

  await persistCommsNotification(validated)
  logger.info(`Comms message processed successfully, eventId: ${validated.id}`)
}

export { processV1CommsData, processV2CommsData }
