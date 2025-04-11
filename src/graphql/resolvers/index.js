import { getCommsEventById, getCommsEventByProperty } from './comms-message.js'
import { getFileMetadataByProperty, getFileMetadataById } from './file-metadata.js'
import scalars from '../schema/scalars/index.js'

const resolvers = {
  Timestamp: scalars.Timestamp,
  StringOrArray: scalars.StringOrArray,
  Query: {
    getFileMetadataByProperty,
    getCommsEventById,
    getCommsEventByProperty,
    getFileMetadataById
  }
}

export default resolvers
