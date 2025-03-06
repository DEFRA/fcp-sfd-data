import { SQSClient } from '@aws-sdk/client-sqs'
import { config } from '../../config/index.js'

const sqsClient = new SQSClient({
  endpoint: config.get('aws.sqsEndpoint'),
  region: config.get('aws.region'),
  credentials: {
    accessKeyId: config.get('aws.accessKeyId'),
    secretAccessKey: config.get('aws.secretAccessKey')
  }
})

export { sqsClient }
