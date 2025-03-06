export const messagingConfig = {
  messaging: {
    waitTimeSeconds: {
      doc: 'The duration (in seconds) for which the call will wait for a message to arrive in the queue before returning.',
      format: Number,
      default: 10,
      env: 'SQS_CONSUMER_WAIT_TIME_SECONDS'
    },
    batchSize: {
      doc: 'The maximum number of messages to return in each call',
      format: Number,
      default: 10,
      env: 'SQS_CONSUMER_BATCH_SIZE'
    },
    pollingWaitTime: {
      doc: 'The duration (in seconds) before sqs-consumer polls for new messages',
      format: Number,
      default: 0,
      env: 'SQS_CONSUMER_POLLING_WAIT_TIME'
    },
    visibilityTimeout: {
      doc: 'The duration (in seconds) that the received messages are hidden from subsequent retrieve requests after being retrieved by a ReceiveMessage request',
      format: Number,
      default: 30,
      env: 'SQS_CONSUMER_VISIBILITY_TIMEOUT'
    },
    heartbeatInterval: {
      doc: 'The interval (in seconds) between requests to extend the message visibility timeout. Must be less than the visibility timeout',
      format: Number,
      default: 5,
      env: 'SQS_CONSUMER_HEARTBEAT_INTERVAL'
    },
    dataIngestion: {
      queueUrl: {
        doc: 'URL for the data ingest queue',
        format: String,
        default: null,
        env: 'DATA_INGEST_QUEUE_URL'
      },
      deadLetterUrl: {
        doc: 'URL for the data ingest dead letter queue',
        format: String,
        default: null,
        env: 'DATA_INGEST_DEAD_LETTER_QUEUE_URL'
      }
    }
  }
}
