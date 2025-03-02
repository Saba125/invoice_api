import { Request, Response } from "express"
import { IDbTools } from "../../../interfaces"
import Utils from "../../../utils"
export default async function delete_city(req: Request, res: Response) {
  const db: IDbTools = req.app.locals.db
  const body = req.body
  console.log(body)
  for (const id of body) {
    const dbRes = await db.delete("city", {
      id,
    })
    if (dbRes.error) {
      return Utils.sendError(res, dbRes.error.message)
    }
  }
  Utils.sendSuccess(res, {
    message: "City deleted",
  })
}
