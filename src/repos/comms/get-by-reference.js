import db from '../../data/db.js'

const getByReference = async (collection, reference) => {
  const documents = await db.collection(collection).find({
    'events.data.personalisation.reference': reference
  }).toArray()

  if (!documents.length) {
    throw new Error(`No document found for the provided reference: ${reference}`)
    // return null?
  }

  return documents.map((document) => ({
    correlationId: document._id,
    events: document.events
  }))
}

export default getByReference
