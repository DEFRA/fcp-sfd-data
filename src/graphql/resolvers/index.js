import commsResolvers from './comms-message/index.js'
import metadataResolvers from './file-metadata/index.js'
import scalars from '../schema/scalars/index.js'

const resolvers = {
  Timestamp: scalars.Timestamp,
  StringOrArray: scalars.StringOrArray,
  Query: {
    ...metadataResolvers,
    ...commsResolvers
  }
}

export default resolvers
