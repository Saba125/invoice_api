import Joi from "joi"
const editCurrencySchema = Joi.object({
  is_default: Joi.boolean().optional(),
  currency_name: Joi.string().optional(),
  code: Joi.string().optional(),
  icon: Joi.string().optional(),
  symbol: Joi.string().optional(),
  currency_rate: Joi.number().optional(),
})
export default editCurrencySchema
