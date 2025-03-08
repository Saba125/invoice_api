import Joi from "joi"
const addInvoiceSchema = Joi.object({
  client_id: Joi.number().required(),
  status: Joi.string().valid("pending", "paid", "overdue"),
  total_amount: Joi.number().optional(),
  currency_id: Joi.number().required(),
  due_date: Joi.date().iso().required(),
  invoice_id: Joi.number().optional(),
  items: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required(),
        description: Joi.string().optional(),
        quantity: Joi.number().integer().positive().required(),
        unit_price: Joi.number().precision(2).positive().required(),
        // total_price: Joi.number().precision(2).positive().required(),
      })
    )
    .min(1)
    .required(),
  note: Joi.string().optional(),
})
export default addInvoiceSchema
