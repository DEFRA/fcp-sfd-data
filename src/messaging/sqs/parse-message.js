import { UNPROCESSABLE_MESSAGE } from '../../constants/error-types.js'

const parseSqsMessage = (message) => {
  try {
    const body = JSON.parse(message.Body)

    if (body.Type === 'Notification' && body.TopicArn) {
      return JSON.parse(body.Message)
    }

    return body
  } catch (err) {
    throw new Error(`Message content (${message.MessageId}) is not valid JSON`, {
      cause: UNPROCESSABLE_MESSAGE
    })
  }
}

export { parseSqsMessage }
