import { sqsClient } from '../../clients/sqs.js'
import { createIngestConsumer } from './data-ingest/consumer.js'

const ingestConsumer = createIngestConsumer(sqsClient)

const startMessaging = () => {
  ingestConsumer.start()
}

const stopMessaging = () => {
  ingestConsumer.stop()
}

export { startMessaging, stopMessaging }
