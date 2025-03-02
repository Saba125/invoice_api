import { Request, Response } from "express"
import { IDbTools, IUser } from "../../../interfaces"
import Utils from "../../../utils"
import editCurrencySchema from "./schema"
export default async function edit_currency(req: Request, res: Response) {
  const db: IDbTools = req.app.locals.db
  const id = parseInt(req.params.id)
  const body = req.body
  const valid = await Utils.validateSchema(res, editCurrencySchema, body)
  if (!valid) return
  const { currency_rate, ...rest } = body

  if (Object.keys(rest).length > 0) {
    const dbRes = await db.update("currencies", {
      id,
      ...rest,
    })
    if (dbRes.error) {
      return Utils.sendError(res, dbRes.error.message)
    }
  }

  if (currency_rate) {
    const dbRes1 = await db.update("currency_value", {
      currency_id: id,
      currency_rate,
    })
    if (dbRes1.error) {
      return Utils.sendError(res, dbRes1.error.message)
    }
  }

  Utils.sendSuccess(res, {
    success: true,
    message: "Currency updated successfully",
  })
}
