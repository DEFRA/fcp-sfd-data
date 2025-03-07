import { notifications } from '../data/index.js'

const persistCommsNotification = async (notification) => {
  await notifications.insertOne(notification)
  // this is tightly coupled to the test... how do we fix this?
  // as part of the db setup created a seperate variable to reference the specific container
}

export {
  persistCommsNotification
}
