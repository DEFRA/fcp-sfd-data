import { UNPROCESSABLE_MESSAGE } from '../../../../constants/error-types.js'

import { createLogger } from '../../../../logging/logger.js'
import { validate } from '../../../../schemas/validate.js'

import { v1 } from '../../../../schemas/comms/index.js'
import { v1 as dataIngestSchema } from '../../../../schemas/data-ingest/index.js'

const logger = createLogger()

const processV1CommsData = async (message) => {
  const [validated, errors] = await validate(v1, message)

  if (errors) {
    logger.error(`Invalid message: ${errors}`)

    throw new Error('Invalid message', {
      cause: UNPROCESSABLE_MESSAGE
    })
  }

  logger.info(`Comms message processed successfully, eventId: ${validated.commsMessage.id}`)
}

const processV2CommsData = async (message) => {
  const [validated, errors] = await validate(dataIngestSchema, message)

  if (errors) {
    logger.error(`Invalid message: ${errors}`)

    throw new Error('Invalid message', {
      cause: UNPROCESSABLE_MESSAGE
    })
  }

  logger.info(`Comms message processed successfully, eventId: ${validated.id}`)
}

export { processV1CommsData, processV2CommsData }
