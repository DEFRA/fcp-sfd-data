import { SQSClient } from '@aws-sdk/client-sqs'

import { config } from '../../config/index.js'

const sqsConfig = {
  endpoint: config.get('aws.sqsEndpoint'),
  region: config.get('aws.region')
}

if (config.get('aws.accessKeyId') || config.get('aws.secretAccessKey')) {
  sqsConfig.credentials = {
    accessKeyId: config.get('aws.accessKeyId'),
    secretAccessKey: config.get('aws.secretAccessKey')
  }
}

const sqsClient = new SQSClient(sqsConfig)

export { sqsClient }
