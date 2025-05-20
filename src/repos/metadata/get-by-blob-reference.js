import db from '../../data/db.js'
import { NotFoundError } from '../../errors/not-found-error.js'

const getByBlobReference = async (collection, blobReference) => {
  const documents = await db.collection(collection).find({
    'events.data.blobReference': blobReference
  }).toArray()

  if (!documents.length) {
    throw new NotFoundError(`No document found for the provided blob reference: ${blobReference}`)
  }

  return documents.map((document) => ({
    correlationId: document._id,
    events: document.events
  }))
}

export default getByBlobReference
