export default {
  query: `query GetCommsEventById($commsEventByPKId: String!) {
    getCommsEventById(id: $commsEventByPKId) {
      correlationId
      events {
        id
        data {
          crn
          sbi
          commsType
          reference
          commsAddresses
          sourceSystem
          emailReplyToId
          statusDetails
          personalisation
          notifyTemplateId
          oneClickUnsubscribeUrl
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
