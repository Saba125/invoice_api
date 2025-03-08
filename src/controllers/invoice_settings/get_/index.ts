import { Request, Response } from "express"
import { IDbTools, IInvSettings, IUser } from "../../../interfaces"
import Utils from "../../../utils"
export default async function get_invoice_settings(
  req: Request,
  res: Response
) {
  const user = req.user as IUser
  const db: IDbTools = req.app.locals.db
  const dbRes = await db.selectSingle(
    `select * from invoice_settings where user_id = $1`,
    [user.id]
  )
  if (!dbRes) {
    return Utils.sendError(res, {
      status: "error",
      message: "Invoice settings not found",
    })
  }
}
