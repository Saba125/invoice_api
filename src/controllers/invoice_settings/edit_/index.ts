import { Request, Response } from "express"
import { IDbTools, IInvSettings, IUser } from "../../../interfaces"
import Utils from "../../../utils"
import invSettingsSchema from "../schema"
export default async function edit_invoice_settings(
  req: Request,
  res: Response
) {
  const id = parseInt(req.params.id)
  const user = req.user as IUser
  const db: IDbTools = req.app.locals.db
  const body = req.body
  const valid = await Utils.validateSchema(res, invSettingsSchema, body)
  if (!valid) return
  const existingSettings = (await db.selectSingle(
    `select * from invoice_settings where id = $1`,
    [id]
  )) as IInvSettings
  if (!existingSettings) {
    return Utils.sendError(res, {
      status: "error",
      message: `Settings with id ${id} is  not found`,
    })
  }
  console.log(existingSettings)
  if (existingSettings.user_id !== user.id) {
    return Utils.sendError(res, {
      status: "Error",
      message: `You can only edit your own settings`,
    })
  }
  const dbRes = await db.update("invoice_settings", {
    id,
    ...body,
  })
  if (dbRes.error) {
    return Utils.sendError(res, dbRes.error.message)
  }
  Utils.sendSuccess(res, {
    data: dbRes.data,
    message: "Settings updated",
  })
}
