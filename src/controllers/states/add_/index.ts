import { Request, Response } from "express"
import { IDbTools } from "../../../interfaces"
import Utils from "../../../utils"

export default async function add_state(req: Request, res: Response) {
  const db: IDbTools = req.app.locals.db
  const body = req.body
  if (!body.name || !body.city_id) {
    return Utils.sendError(res, {
      status: "error",
      message: "Please provide name and city uid",
    })
  }
  const existingState = await db.selectSingle(
    `select * from state where name = $1`,
    [body.name]
  )
  if (existingState) {
    return Utils.sendError(res, {
      status: "error",
      message: "State with that name already exists",
    })
  }
  const dbRes = await db.insert("state", {
    name: body.name,
    city_id: body.city_id,
  })
  if (dbRes.error) {
    return Utils.sendError(res, dbRes.error.message)
  }
  Utils.sendSuccess(res, {
    state: dbRes.data,
  })
}
