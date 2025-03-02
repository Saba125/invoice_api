import { Request, Response } from "express"
import { IDbTools } from "../../../interfaces"
import Utils from "../../../utils"
export default async function edit_state(req: Request, res: Response) {
  const id = parseInt(req.params.id)
  const db: IDbTools = req.app.locals.db
  const body = req.body
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
  const dbRes = await db.update("state", {
    id,
    name: body.name,
    city_id: body.city_id,
  })
  if (dbRes.error) {
    return Utils.sendError(res, dbRes.error.message)
  }
  Utils.sendSuccess(res, {
    state: dbRes.data
  })
}
