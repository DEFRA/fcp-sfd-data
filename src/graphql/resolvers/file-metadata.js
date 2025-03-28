const getFileMetadataByProperty = async (_, { key, value }, { dataSources }) => {
  return dataSources.fileMetadata.getByProperty(key, value)
}

export {
  getFileMetadataByProperty
}
