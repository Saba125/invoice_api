import { Request, Response } from "express"
import { IDbTools, IUser } from "../../../interfaces"
import Utils from "../../../utils"
import editCurrencySchema from "./schema"
export default async function edit_currency(req: Request, res: Response) {
  const db: IDbTools = req.app.locals.db
  const id = parseInt(req.params.id)
  const body = req.body
  const valid = await Utils.validateSchema(res, editCurrencySchema, body)
  const { currency_rate, ...rest } = body
  if (!valid) return

  const paramsForValue = {
    currency_date: new Date(),
    currency_rate: body.currency_rate,
  }
  const dbRes = await db.update("currencies", {
    id,
    ...rest,
  })
  if (dbRes.error) {
    return Utils.sendError(res, dbRes.error.message)
  }
  // const dbRes1 = await db.update("currency_value", {
  //   currency_id: id,
  // })
  // if (dbRes1.error) {
  //   return Utils.sendError(res, dbRes1.error.message)
  // }
  Utils.sendSuccess(res, {
    currency: dbRes.data,
  })
}
