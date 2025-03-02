import { Request, Response } from "express"
import { IDbTools } from "../../../interfaces"
import Utils from "../../../utils"
export default async function delete_state(req: Request, res: Response) {
  const db: IDbTools = req.app.locals.db
  const body = req.body
  for (const id of body) {
    const dbRes = await db.delete("state", {
      id,
    })
    if (dbRes.error) {
      return Utils.sendError(res, dbRes.error.message)
    }
  }
  Utils.sendSuccess(res, "States deleted")
}
