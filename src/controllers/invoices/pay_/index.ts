import { Request, Response } from "express"
import { IClient, IDbTools, IInvoice } from "../../../interfaces"
import Utils from "../../../utils"
export default async function pay_invoice(req: Request, res: Response) {
  const db: IDbTools = req.app.locals.db
  const body = req.body
  const existingClient = (await db.selectSingle(
    `select * from clients where id = $1`,
    [body.client_id]
  )) as IClient
  if (!existingClient) {
    return Utils.sendError(res, {
      status: "error",
      message: `Client with id ${body.client_id} is not found`,
    })
  }
  const invoice = (await db.selectSingle(
    `select * from invoices where id = $1 and client_id = $2`,
    [body.invoice_id, body.client_id]
  )) as IInvoice
  if (!invoice) {
    return Utils.sendError(res, {
      status: "error",
      message: `Invoice with id ${body.invoice_id} is not found`,
    })
  }
  const currentDate = new Date()
  if (invoice.due_date < currentDate) {
    return Utils.sendError(res, {
      status: "error",
      message: "You are very late...",
    })
  }
  if (existingClient.ballance < invoice.total_amount) {
    return Utils.sendError(res, {
      status: "error",
      message: "You don't have enough money to pay the invoice",
    })
  }

  await db.update("clients", {
    id: existingClient.id,
    ballance: existingClient.ballance - invoice.total_amount,
  })

  await db.update("invoices", {
    id: body.invoice_id,
    status: "paid",
  })
  Utils.sendSuccess(res, {
    message: "Invoice successfully paid",
  })
}
