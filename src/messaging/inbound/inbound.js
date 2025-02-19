import { sqsClient } from '../sqs/client.js'
import { startIngestion, stopIngestion } from './data-ingest/consumer.js'

const startMessaging = () => {
  startIngestion(sqsClient)
}

const stopMessaging = () => {
  stopIngestion()
}

export { startMessaging, stopMessaging }
