import Joi from "joi"
const verifyEmailSchema = Joi.object({
  verificationCode: Joi.string().required(),
  email: Joi.string().email().required(),
})
export default verifyEmailSchema
