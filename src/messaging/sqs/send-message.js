import { SendMessageCommand } from '@aws-sdk/client-sqs'

import { createLogger } from '../../logging/logger.js'

const logger = createLogger()

const sendMessage = async (sqsClient, queueUrl, message) => {
  const command = new SendMessageCommand({
    QueueUrl: queueUrl,
    MessageBody: message
  })

  try {
    await sqsClient.send(command)
  } catch (err) {
    logger.error(err)
  }
}

export { sendMessage }
