import Joi from "joi"
const addClientSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  company: Joi.string().required(),
  address: Joi.string().required(),
  city_id: Joi.number().required(),
  currency_id: Joi.number().required(),
  ballance: Joi.number().required(),
})
export default addClientSchema
