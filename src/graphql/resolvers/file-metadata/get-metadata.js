const getMetadata = async (_, { key, value }) => {
  return {
    getMetadata: {
      test: 'getMetadata'
    }
  }
}

export default getMetadata
