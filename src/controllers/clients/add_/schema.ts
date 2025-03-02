import Joi from "joi"
const addClientSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  company: Joi.string().required(),
  address: Joi.string().required(),
  city_id: Joi.string().required(),
})
export default addClientSchema
