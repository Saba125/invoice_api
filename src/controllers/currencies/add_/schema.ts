import Joi from "joi"
const addCurrencySchema = Joi.object({
  is_default: Joi.boolean().required(),
  currency_name: Joi.string().required(),
  code: Joi.string().required(),
  icon: Joi.string().optional(),
  symbol: Joi.string().required(),
  currency_rate: Joi.number().required(),
})
export default addCurrencySchema
