import { Request, Response } from "express"
import { IDbTools } from "../../../interfaces"
import Utils from "../../../utils"
import calculateTotalItemPrices from "../../../utils/calculate_total_price"
export default async function edit_invoice(req: Request, res: Response) {
  const db: IDbTools = req.app.locals.db
  const id = parseInt(req.params.id)
  const body = req.body
  const existingInvoice: any = await db.selectSingle(
    `select * from invoices where id = $1`,
    [id]
  )
  if (!existingInvoice) {
    return Utils.sendError(res, {
      status: "error",
      message: `Invoice with id ${id} is not found`,
    })
  }
  let invoiceTotalAmount = existingInvoice.total_amount
  const { invoice, invoice_items } = body
  if (invoice_items) {
    invoiceTotalAmount = calculateTotalItemPrices(invoice_items)
    for (const item of invoice_items) {
      const totalPrice = item.unit_price * item.quantity
      const dbRes1 = await db.update("invoice_items", {
        id: item.id,
        name: item.name,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: totalPrice,
      })
      if (dbRes1.error) {
        return Utils.sendError(res, dbRes1.error.message)
      }
    }
  }
  if (invoice) {
    const { total_amount, ...rest } = invoice
    const dbRes = await db.update("invoices", {
      id,
      ...rest,
      total_amount: invoiceTotalAmount,
    })
    if (dbRes.error) {
      return Utils.sendError(res, dbRes.error.message)
    }
  }
}
