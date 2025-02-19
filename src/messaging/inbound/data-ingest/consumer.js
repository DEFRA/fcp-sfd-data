import { Consumer } from 'sqs-consumer'

import { createLogger } from '../../../logging/logger.js'
import { config } from '../../../config/index.js'
import { handleIngestionMessages } from './handler.js'

const logger = createLogger()

let ingestionConsumer

const startIngestion = (sqsClient) => {
  ingestionConsumer = Consumer.create({
    queueUrl: config.get('messaging.dataIngestion.queueUrl'),
    batchSize: 10,
    visibilityTimeout: config.get('messaging.visibilityTimeout'),
    heartbeatInterval: config.get('messaging.heartbeatInterval'),
    waitTimeSeconds: config.get('messaging.waitTimeSeconds'),
    pollingWaitTime: config.get('messaging.pollingWaitTime'),
    handleMessageBatch: async (messages) => handleIngestionMessages(sqsClient, messages),
    sqs: sqsClient
  })

  ingestionConsumer.on('started', () => {
    logger.info('Data ingestion consumer started')
  })

  ingestionConsumer.on('stopped', () => {
    logger.info('Data ingestion consumer stopped')
  })

  ingestionConsumer.on('error', (err) => {
    logger.error(`Error during data ingestion message handling: ${err.message}`)
  })

  ingestionConsumer.on('processing_error', (err) => {
    logger.error(`Error during data ingestion message processing: ${err.message}`)
  })

  ingestionConsumer.on('timeout_error', (err) => {
    logger.error(`Timeout error during data ingestion message handling: ${err.message}`)
  })

  ingestionConsumer.start()
}

const stopIngestion = () => {
  ingestionConsumer.stop()
}

export { startIngestion, stopIngestion }
