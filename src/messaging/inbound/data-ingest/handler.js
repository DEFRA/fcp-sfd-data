import { config } from '../../../config/index.js'

import { createLogger } from '../../../logging/logger.js'

import { getProcessor } from './processors/processor.js'

import { sendMessage } from '../../sqs/send-message.js'
import { parseSqsMessage } from '../../sqs/parse-message.js'

import { UnprocessableMessageError } from '../../../errors/message-errors.js'

const logger = createLogger()

const handleIngestionMessages = async (sqsClient, messages) => {
  const completed = []

  for (const message of messages) {
    try {
      const content = parseSqsMessage(message)

      const processor = getProcessor(content)

      await processor(content)

      completed.push(message)
    } catch (err) {
      logger.error(`Error processing message: ${err.message}`)

      if (err instanceof UnprocessableMessageError) {
        logger.info('Moving unprocessable message to dead letter queue')

        completed.push(message)

        await sendMessage(
          sqsClient,
          config.get('messaging.dataIngestion.deadLetterUrl'),
          message?.Body
        )
      }
    }
  }

  return completed
}

export { handleIngestionMessages }
