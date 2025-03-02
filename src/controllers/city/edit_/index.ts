import { Request, Response } from "express"
import { IDbTools } from "../../../interfaces"
import Utils from "../../../utils"
export default async function edit_city(req: Request, res: Response) {
  const id = parseInt(req.params.id)
  const db: IDbTools = req.app.locals.db
  const body = req.body
  const existingCity = await db.selectSingle(
    `select * from city where name = $1`,
    [body.name]
  )
  if (existingCity) {
    return Utils.sendError(res, {
      status: "error",
      message: "City with that name already exists",
    })
  }
  const dbRes = await db.update("city", {
    id,
    name: body.name,
  })
  if (dbRes.error) {
    return Utils.sendError(res, dbRes.error.message)
  }
  Utils.sendSuccess(res, {
    city: dbRes.data,
  })
}
