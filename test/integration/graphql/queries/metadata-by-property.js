export default {
  query: `query GetFileMetadataByProperty($key: fileMetadataEnum!, $value: StringOrArray!) {
    getFileMetadataByProperty(key: $key, value: $value) {
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
