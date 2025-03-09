import { Request, Response } from "express"
import { IDbTools, IUser } from "../../../interfaces"
import Utils from "../../../utils"
import invSettingsSchema from "../schema"
export default async function add_invoice_settings(
  req: Request,
  res: Response
) {
  const db: IDbTools = req.app.locals.db
  const body = req.body
  const user = req.user as IUser
  const valid = await Utils.validateSchema(res, invSettingsSchema, body)
  if (!valid) return
  const existingSettings = await db.selectSingle(
    `select * from invoice_settings where user_id = $1`,
    [user.id]
  )
  if (existingSettings) {
    return Utils.sendError(res, {
      status: "error",
      message: "You already have existing settings",
    })
  }
  const dbRes = await db.insert("invoice_settings", {
    ...body,
    user_id: user.id,
  })
  if (dbRes.error) {
    return Utils.sendError(res, dbRes.error.message)
  }
  Utils.sendSuccess(res, {
    settings: dbRes.data,
  })
}
