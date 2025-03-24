const typeDefinitions = `#graphql
""" Scalars for custom data types """
scalar JSON
scalar Timestamp
scalar JSONObject
scalar StringOrArray

""" Available query operations """
type Query {
  """
  GET a specific comms event by its ID
  """
  commsEventByPK(id: String!): CommsEvent

  """
  GET comms events filtered by a specific property and value
  """
  commsEventByProperty(key: commsEnum!, value: StringOrArray!): [CommsEvent]
}

""" Comms event received from the upstream comms service """
type CommsEvent {
  """ Unique identifier for the comms event (UUID standard) """
  id: String

  """ Date and time when event has been saved in fd-data database """
  dateCreated: Timestamp

  """ Details of the event message """
  commsMessage: commsMessageDetails
}

""" Details of a communication message """
type commsMessageDetails {
  """ Unique identifier for the comms message """
  id: String

  """ Structured business data related to the comms message """
  data: commsData

  """ Time of the message """
  time: Timestamp

  """ Type of the message """
  type: String

  """ Source system of the message """
  source: String

  """ Specification version of the message (Cloud Events format) """
  specversion: String

  """ Content type of the message data """
  datacontenttype: String
}

""" Data structure for communication content """
type commsData {
  """ Customer Reference Number """
  crn: String

  """ Single Business Identifier """
  sbi: String

  """ Type of the communication (e.g., email, sms) """
  commsType: String

  """ Reference identifier for the communication """
  reference: String

  """ Address (email, phone, etc.) for the communication """
  commsAddresses: StringOrArray

  """ System that generated the communication """
  sourceSystem: String

  """ Reply-to GovNotify identifier for email communication """
  emailReplyToId: String

  """ Detailed status of the communication """
  statusDetails: JSONObject

  """ Correlation ID for tracking """
  correlationId: String

  """ Personalisation data for the GovNotify communication """
  personalisation: JSONObject

  """ govNotify template ID """
  notifyTemplateId: String

  """ govNotify unsubscribe URL """
  oneClickUnsubscribeUrl: String
}

""" Enumeration for comms properties """
enum commsEnum {
  """ UUID of the comms event """
  ID

  """ Date the event was created in database """
  TIME

  """ Type of the message """
  TYPE

  """ Source system """
  SOURCE

  """ Specification version """
  SPECVERSION

  """ Data content type """
  DATACONTENTTYPE

  """ Date the event was created """
  DATE_CREATED

  """ Comms message object """
  COMMS_MESSAGE

  """ Customer Reference Number """
  CRN

  """ Single Business Identifier """
  SBI

  """ Type of the communication (default: email) """
  COMMS_TYPE

  """ Reference identifier """
  REFERENCE

  """ Communication address """
  COMMS_ADDRESSES

  """ Source system of the communication """
  SOURCE_SYSTEM

  """ Reply-to identifier for emails """
  EMAIL_REPLY_TO_ID

  """ Correlation ID for tracking """
  CORRELATION_ID

  """ Personalisation data """
  PERSONALISATION

  """ GovNotify template ID """
  NOTIFY_TEMPLATE_ID
}
`

export default typeDefinitions
