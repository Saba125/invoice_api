import { Request, Response } from "express"
import { IDbTools } from "../../../interfaces"
import Utils from "../../../utils"
export default async function add_city(req: Request, res: Response) {
  const db: IDbTools = req.app.locals.db
  const body = req.body
  if (!body.name) {
    return Utils.sendError(res, {
      status: "error",
      message: "Name is required",
    })
  }
  const checkExistingCity = await db.selectSingle(
    `select * from city where name = $1`,
    [body.name]
  )
  if (checkExistingCity) {
    return Utils.sendError(res, {
      status: "error",
      message: "City already exists",
    })
  }
  const dbRes = await db.insert("city", {
    name: body.name,
  })
  if (dbRes.error) {
    return Utils.sendError(res, dbRes.error.message)
  }
  Utils.sendSuccess(res, dbRes.data)
}
