import Joi from "joi"
const editClientSchema = Joi.object({
  name: Joi.string().optional(),
  email: Joi.string().email().optional(),
  phone: Joi.string().optional(),
  company: Joi.string().optional(),
  address: Joi.string().optional(),
  city_id: Joi.number().optional(),
  currency_id: Joi.number().optional(),
})
export default editClientSchema
