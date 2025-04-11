const getFileMetadataByProperty = async (_, { key, value }, { dataSources }) => {
  return dataSources.fileMetadata.getByProperty(key, value)
}

const getFileMetadataById = async (_, { id }, { dataSources }) => {
  return dataSources.fileMetadata.getById(id)
}

export {
  getFileMetadataByProperty,
  getFileMetadataById
}
