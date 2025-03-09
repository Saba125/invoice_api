import { Request, Response } from "express"
import {
  IClient,
  IDbTools,
  IInvSettings,
  InvoiceItems,
  IUser,
} from "../../../interfaces"
import Utils from "../../../utils"
import addInvoiceSchema from "./schema"
import { send_invoice } from "../../../mail"
import generateInvNumber from "../../../utils/generate_inv_number"
import moment from "moment"
import calculateTotalItemPrices from "../../../utils/calculate_total_price"
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
  const invSettings = (await db.selectSingle(
    `select * from invoice_settings where user_id = $1`,
    [user.id]
  )) as IInvSettings
  if (!invSettings) {
    return Utils.sendError(res, {
      status: "error",
      message: "Invoice settings not found",
    })
  }
  const invoice_number = generateInvNumber(
    invSettings.inv_number_length,
    invSettings.inv_prefix,
    invSettings.inv_suffix,
    invSettings.upper_case,
    invSettings.lower_case
  )
  const totalPrice = calculateTotalItemPrices(items)
  const dbRes = await db.insert("invoices", {
    user_id: user.id,
    client_id: body.client_id,
    total_amount: totalPrice,
    currency_id: body.currency_id,
    due_date: body.due_date,
    invoice_number,
  })
  if (dbRes.error) {
    return Utils.sendError(res, dbRes.error.message)
  }
  const invoice_create_date = moment(dbRes.data.create_date).format(
    "MMMM Do YYYY"
  )
  const invoice_due_date = moment(dbRes.data.due_date).format("MMMM Do YYYY")
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
    invoice_number: dbRes.data.invoice_number,
    company: existingClient.company,
    create_date: invoice_create_date,
    due_date: invoice_due_date,
    items,
    total_price: totalPrice,
    note: dbRes.data.note,
  }
  await send_invoice(existingClient.email, emailData)
  Utils.sendSuccess(res, {
    status: "Invoice has been created",
  })
}
