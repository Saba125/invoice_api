import Joi from "joi"
const invSettingsSchema = Joi.object({
  inv_prefix: Joi.string().optional(),
  inv_suffix: Joi.string().optional(),
  inv_number_length: Joi.number().optional(),
  upper_case: Joi.boolean().default(false).optional(),
  lower_case: Joi.boolean().default(false).optional(),
  is_number: Joi.boolean().default(true).optional(),
  start_inv_number: Joi.number().optional(),
})
export default invSettingsSchema
