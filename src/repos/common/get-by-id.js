import db from '../../data/db.js'

const getById = async (collection, id) => {
  const document = await db.collection(collection).findOne({ _id: id })

  if (!document) {
    throw new Error(`No document found with id: ${id}`)
  }

  return { correlationId: document._id, events: document.events }
}

export default getById
