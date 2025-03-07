import db from '../data/index.js'

const persistCommsNotification = async (notification) => {
  const collection = db.collection('testCollection') // this is tightly coupled to the test... how do we fix this?
  await collection.insertOne(notification)
}

export {
  persistCommsNotification
}
