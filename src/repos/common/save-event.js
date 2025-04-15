import db from '../../data/db.js'
const checkIdempotency = async (collection, event) => {
  try {
    const notification = await db.collection(collection).findOne({
      'events.id': event.id,
      'events.source': event.source
    })
    return notification != null
  } catch (err) {
    throw new Error(`Error checking idempotency token: ${err.message}`, {
      cause: err
    })
  }
}

const saveEvent = async (collection, event) => {
  const correlationId = event.data.correlationId

  if (!correlationId) {
    throw new Error('Correlation ID is required')
  }

  if (await checkIdempotency(collection, event)) {
    throw new Error(`Idempotency check failed, event not saved ${event.id}`)
  }

  await db.collection(collection).updateOne(
    { _id: correlationId },
    { $push: { events: event } },
    { upsert: true }
  )
}

export default saveEvent
