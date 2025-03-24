const typeDefinitions = `#graphql
""" Scalars for custom data types """
scalar JSON
scalar Timestamp
scalar JSONObject
scalar StringOrArray

""" Available query operations """
type Query {
  """
  GET metadata filtered by a specific property and value
  """
  getMetadata(key: fileMetadataEnum!, value: StringOrArray!): [FileMetadata]
}

""" Metadata received """
type FileMetadata {
  """ Unique identifier for the file metadata """
  id: String

  """ Date and time when metadata has been saved in fd-data database """
  dateCreated: Timestamp

  """ Metadata message in cloudevents format """
  metadata: metadataDetails
}

""" Details of the metadata """
type metadataDetails {
  """ Unique identifier for the metadata """
  id: String

  """ Structured business data related to the metadata """
  data: metadata

  """ Time metadata event was sent """
  time: Timestamp

  """ Type of metadata event in reverse dns format """
  type: String

  """ Service that generated the event """
  source: String

  """ Specification version of the metadata (cloudevents format) """
  specversion: String

  """ Content type of the metadata data """
  datacontenttype: String
}

""" Data structure for metadata content """
type metadata {
  """ Single Business Identifier """
  sbi: String

  """ Unique reference for the blob """
  blobReference: String
}

""" Enumeration for file metadata """
enum fileMetadataEnum {
  """ Single Business Identifier """
  SBI

  """ Unique reference for the blob """
  BLOB_REFERENCE
}
`

export default typeDefinitions
