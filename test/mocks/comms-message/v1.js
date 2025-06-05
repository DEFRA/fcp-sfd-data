export default {
  id: '550e8400-e29b-41d4-a716-446655440000',
  commsMessage: {
    id: 'a058de5b-42ad-473c-91e7-0797a43fda30',
    source: 'ffc-ahwr-claim',
    specversion: '1.0',
    type: 'uk.gov.fcp.sfd.notification.request',
    datacontenttype: 'application/json',
    time: '2023-10-17T14:48:00.000Z',
    data: {
      correlationId: 'a058de5b-42ad-473c-91e7-0797a43fda30',
      crn: '1050000000',
      sbi: '105000000',
      sourceSystem: 'AHWP',
      notifyTemplateId: 'd8017132-1909-4bee-b604-b07e8081dc82',
      commsType: 'email',
      recipient: 'jane.doe@defra.gov.uk',
      personalisation: {
        reference: 'test-reference',
        applicationReference: 'test-application-reference',
        amount: '100'
      },
      reference: 'ffc-ahwr-example-reference',
      statusDetails: { status: 'delivered' },
      oneClickUnsubscribeUrl: 'https://unsubscribe.example.com',
      emailReplyToId: '8e222534-7f05-4972-86e3-17c5d9f894e2'
    }
  }
}
