import Joi from 'joi'

const v1 = Joi.object({
  id: Joi.string().guid({ version: ['uuidv4'] }).required(),
  metadata: Joi.object().required()
}).required()

export default v1
