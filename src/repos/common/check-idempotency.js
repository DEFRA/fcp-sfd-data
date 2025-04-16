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

export default checkIdempotency
