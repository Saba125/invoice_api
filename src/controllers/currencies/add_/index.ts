import { Request, Response } from "express"
import { IDbTools, IUser } from "../../../interfaces"
import Utils from "../../../utils"
import addCurrencySchema from "./schema"
export default async function add_currency(req: Request, res: Response) {
  const db: IDbTools = req.app.locals.db
  const body = req.body
  const valid = await Utils.validateSchema(res, addCurrencySchema, body)
  if (!valid) return
  const user = req.user as IUser
  const dbRes = await db.insert("currencies", {
    is_default: body.is_default,
    currency_name: body.currency_name,
    code: body.code,
    icon: body.icon,
    symbol: body.symbol,
    user_id: user.id,
  })
  if (dbRes.error) {
    return Utils.sendError(res, dbRes.error.message)
  }
  const dbRes1 = await db.insert("currency_value", {
    currency_date: new Date(),
    currency_rate: parseFloat(body.currency_rate),
    currency_id: dbRes.data.id,
  })
  if (dbRes1.error) {
    return Utils.sendError(res, dbRes1.error.message)
  }
  Utils.sendSuccess(res, {
    currency: dbRes.data,
  })
}
