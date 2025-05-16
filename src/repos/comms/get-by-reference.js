import db from '../../data/db.js'
import { NotFoundError } from '../../errors/not-found-error.js'

const getByReference = async (collection, reference) => {
  const documents = await db.collection(collection).find({
    'events.data.reference': reference
  }).toArray()

  if (!documents.length) {
    throw new NotFoundError(`No document found for the provided reference: ${reference}`)
  }

  return documents.map((document) => ({
    correlationId: document._id,
    events: document.events
  }))
}

export default getByReference
