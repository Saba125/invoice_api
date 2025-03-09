import { Request, Response } from "express"
import { IClient, IDbTools, IInvoice, IUser } from "../../../interfaces"
import Utils from "../../../utils"
import moment from "moment"
import calculateTotalItemPrices from "../../../utils/calculate_total_price"
export default async function preview_invoice(req: Request, res: Response) {
  const db: IDbTools = req.app.locals.db
  const body = req.body
  const user = req.user as IUser
  const invoice = (await db.selectSingle(
    `select * from invoices where id = $1`,
    [body.invoice_id]
  )) as IInvoice
  if (!invoice) {
    return Utils.sendError(res, {
      status: "error",
      message: `Invoice with id ${body.invoice_id} is not found`,
    })
  }
  const invoice_items = await db.select(
    `select * from invoice_items where invoice_id = $1`,
    [invoice.id]
  )
  const totalPrice = calculateTotalItemPrices(invoice_items.list!)
  if (invoice_items.list?.length === 0) {
    return Utils.sendError(res, {
      status: "error",
      message: "Invoice items are empty",
    })
  }
  const client = (await db.selectSingle(`select * from clients where id = $1`, [
    invoice.client_id,
  ])) as IClient
  if (!client) {
    return Utils.sendError(res, {
      status: "Error",
      message: "Client not found",
    })
  }
  const invoice_create_date = moment(invoice.created_at).format("MMMM Do YYYY")
  const invoice_due_date = moment(invoice.due_date).format("MMMM Do YYYY")

  const emailData = {
    invoice_number: invoice.invoice_number,
    company: client.company,
    create_date: invoice_create_date,
    due_date: invoice_due_date,
    items: invoice_items.list,
    total_price: totalPrice,
    note: invoice.note,
  }
  res.render("invoice", emailData)
}
