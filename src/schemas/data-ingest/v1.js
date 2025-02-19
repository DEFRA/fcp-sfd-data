import Joi from 'joi'

const v2 = Joi.object({
  id: Joi.string().guid({ version: ['uuidv4'] }).required(),
  source: Joi.string().required(),
  specversion: Joi.string().required(),
  type: Joi.string().required(),
  datacontenttype: Joi.string().valid('application/json').required(),
  time: Joi.string().isoDate().required(),
  data: Joi.object().required()
}).required()

export default v2
