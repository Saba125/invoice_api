import { Request, Response } from "express"
import { IDbTools, IUser } from "../../../interfaces"
import Utils from "../../../utils"
import editClientSchema from "./schema"
export default async function edit_client(req: Request, res: Response) {
  const id = parseInt(req.params.id)
  const db: IDbTools = req.app.locals.db
  const body = req.body
  const valid = await Utils.validateSchema(res, editClientSchema, body)
  if (!valid) return
  const dbRes = await db.update("clients", {
    id,
    ...body,
  })
  if (dbRes.error) {
    return Utils.sendError(res, dbRes.error.message)
  }
  Utils.sendSuccess(res, {
    clienbt: dbRes.data,
  })
}
