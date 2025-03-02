import { Request, Response } from "express"
import { IDbTools, IUser } from "../../../interfaces"
import Utils from "../../../utils"
export default async function delete_currency(req: Request, res: Response) {
  const db: IDbTools = req.app.locals.db
  const id = parseInt(req.params.id)
  const dbRes = await db.delete("currencies", {
    id,
  })
  if (dbRes.error) {
    return Utils.sendError(res, dbRes.error.message)
  }
  const dbRes1 = await db.delete("currency_value", {
    currency_id: id,
  })
  if (dbRes1.error) {
    return Utils.sendError(res, dbRes1.error.message)
  }
  Utils.sendSuccess(res, "Currency deleted")
}
