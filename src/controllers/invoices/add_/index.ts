import { Request, Response } from "express"
import { IClient, IDbTools, InvoiceItems, IUser } from "../../../interfaces"
import Utils from "../../../utils"
import addInvoiceSchema from "./schema"
import { send_invoice } from "../../../mail"
export default async function add_invoice(req: Request, res: Response) {
  const db: IDbTools = req.app.locals.db
  const body = req.body
  const items: InvoiceItems[] = body.items
  const valid = await Utils.validateSchema(res, addInvoiceSchema, body)
  if (!valid) return
  const user = req.user as IUser
  const existingClient = (await db.selectSingle(
    `select * from clients where id = $1`,
    [body.client_id]
  )) as IClient
  if (!existingClient) {
    return Utils.sendError(res, {
      status: "error",
      message: `Client with id ${body.client} is not found`,
    })
  }
  const totalPrice = items.reduce((acc, item) => {
    return acc + item.unit_price * item.quantity
  }, 0)
  const dbRes = await db.insert("invoices", {
    user_id: user.id,
    client_id: body.client_id,
    total_amount: totalPrice,
    currency_id: body.currency_id,
    due_date: body.due_date,
  })
  if (dbRes.error) {
    return Utils.sendError(res, dbRes.error.message)
  }
  for (const item of items) {
    const totalPrice = item.unit_price * item.quantity
    const dbRes1 = await db.insert("invoice_items", {
      invoice_id: dbRes.data.id,
      name: item.name,
      description: item.description,
      quantity: item.quantity,
      unit_price: item.quantity,
      total_price: totalPrice,
    })
    if (dbRes1.error) {
      return Utils.sendError(res, dbRes1.error.message)
    }
  }
  const emailData = {
    text: "test Data",
  }
  await send_invoice(existingClient.email, emailData)
  Utils.sendSuccess(res, {
    status: "Invoice has been created",
  })
}
