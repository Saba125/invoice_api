import { Request, Response } from "express"
import { IDbTools, IUser } from "../../../interfaces"
import Utils from "../../../utils"
export default async function get_invoices(req: Request, res: Response) {
  const db: IDbTools = req.app.locals.db
  const user = req.user as IUser
  const dbRes = await db.select(`select * from invoices where user_id = $1`, [
    user.id,
  ])
  Utils.sendSuccess(res, {
    invoices: dbRes.list,
  })
}
