export default {
  query: `query GetFileMetadataById($metadataByPKId: String!) {
    getFileMetadataById(id: $metadataByPKId) {
      correlationId
      events {
        id
        data {
          sbi
          blobReference
          correlationId
        }
        time
        type
        source
        specversion
        datacontenttype
      }
    }
  }`
}
