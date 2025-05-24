import db from '../../src/data/db.js'

const insertMockEventToDb = async (collection, id, mockEvents) => {
  await db.collection(collection).insertOne({
    _id: id,
    events: Array.isArray(mockEvents) ? mockEvents : [mockEvents]
  })
}

const clearCollection = async (collection) => {
  await db.collection(collection).deleteMany({})
}

export {
  insertMockEventToDb,
  clearCollection
}
