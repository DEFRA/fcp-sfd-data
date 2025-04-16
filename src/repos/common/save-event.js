import db from '../../data/db.js'

const saveEvent = async (collection, event) => {
  const correlationId = event.data.correlationId

  if (!correlationId) {
    throw new Error('Correlation ID is required')
  }

  await db.collection(collection).updateOne(
    { _id: correlationId },
    { $push: { events: event } },
    { upsert: true }
  )
}

export default saveEvent
