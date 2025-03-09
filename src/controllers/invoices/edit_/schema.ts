import Joi from "joi"
const addInvoiceSchema = Joi.object({
  client_id: Joi.number().optional(),
  status: Joi.string().valid("pending", "paid", "overdue"),
  total_amount: Joi.number().optional(),
  currency_id: Joi.number().optional(),
  due_date: Joi.date().iso().optional(),
  invoice_id: Joi.number().optional(),
  items: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().optional(),
        description: Joi.string().optional(),
        quantity: Joi.number().integer().positive().optional(),
        unit_price: Joi.number().precision(2).positive().optional(),
        // total_price: Joi.number().precision(2).positive().optional(),
      })
    )
    .min(1)
    .optional(),
  note: Joi.string().optional(),
})
export default addInvoiceSchema
