import util from 'util'

const handleDataEventMessage = async (message) => {
  const body = JSON.parse(message.Body)
  const content = JSON.parse(body.Message)

  console.log(`Received message: ${util.inspect(content)}`)
}

export { handleDataEventMessage }
