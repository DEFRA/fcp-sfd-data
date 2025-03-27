export default {
  query: `query CommsEventByProperty($key: commsEnum!, $value: StringOrArray!) {
            getCommsEventByProperty(key: $key, value: $value) {
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
                  correlationId
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
