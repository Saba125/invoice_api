import Joi from "joi"
const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  role: Joi.string().valid("buyer", "seller", "admin").optional(),
})
export default registerSchema
