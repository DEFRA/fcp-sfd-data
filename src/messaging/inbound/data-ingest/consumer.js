import { Consumer } from 'sqs-consumer'

import { createLogger } from '../../../logging/logger.js'
import { config } from '../../../config/index.js'
import { handleDataEventMessage } from './handler.js'

const logger = createLogger()

const createIngestConsumer = (sqs) => {
  const ingestConsumer = Consumer.create({
    queueUrl: config.get('messaging.dataIngestQueueUrl'),
    batchSize: 10,
    handleMessageBatch: async (messages) => {
      for (const message of messages) {
        await handleDataEventMessage(message)
      }
    },
    sqs
  })

  ingestConsumer.on('started', () => {
    logger.info('Data layer ingestion consumer started')
  })

  ingestConsumer.on('stopped', () => {
    logger.info('Data layer ingestion consumer stopped')
  })

  ingestConsumer.on('message_processed', (message) => {
    logger.info(`Data layer ingestion message processed: ${message.MessageId}`)
  })

  ingestConsumer.on('error', (err) => {
    logger.error(`Data layer ingestion error: ${err.message}`)
  })

  ingestConsumer.on('processing_error', (err) => {
    logger.error(`Data layer ingestion processing error: ${err.message}`)
  })

  return ingestConsumer
}

export { createIngestConsumer }
