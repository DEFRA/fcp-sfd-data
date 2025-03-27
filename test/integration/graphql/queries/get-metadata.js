//! TODO: Update this query
export default {
  query: `query FileMetadata($key: fileMetadataEnum!, $value: StringOrArray!) {
  getMetadata(key: $key, value: $value) {
    id
    metadata {
      id
      data {
        sbi
        blobReference
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
