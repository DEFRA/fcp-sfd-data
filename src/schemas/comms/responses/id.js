import Joi from 'joi'

const resultModel = Joi.object({
  data: Joi.object({
    correlationId: Joi.string().guid({ version: 'uuidv4' }).required(),
    events: Joi.array().items(
      Joi.object({
        id: Joi.string().guid({ version: 'uuidv4' }).required(),
        source: Joi.string().required(),
        specversion: Joi.string().required(),
        type: Joi.string().required(),
        datacontenttype: Joi.string().required(),
        time: Joi.date().required(),
        data: Joi.object({
          correlationId: Joi.string().uuid().optional(),
          crn: Joi.string().optional(),
          sbi: Joi.string().optional(),
          sourceSystem: Joi.string().optional(),
          notifyTemplateId: Joi.string().uuid().optional(),
          commsType: Joi.string().optional(),
          recipient: Joi.string().email(),
          personalisation: Joi.object({}).optional().label('personalisation'),
          reference: Joi.string().optional(),
          statusDetails: Joi.object({}).optional(),
          oneClickUnsubscribeUrl: Joi.string().uri().optional(),
          emailReplyToId: Joi.string().uuid().optional()
        }).required().label('data')
      }).label('Cloud Events')
    ).required().label('Events')
  }).label('Comms Notification')
}).label('Get By ID Response')

export { resultModel }
