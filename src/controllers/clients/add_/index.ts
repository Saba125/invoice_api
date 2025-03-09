import { Request, Response } from "express"
import { IDbTools, IUser } from "../../../interfaces"
import Utils from "../../../utils"
import addClientSchema from "./schema"
export default async function add_client(req: Request, res: Response) {
  const db: IDbTools = req.app.locals.db
  const body = req.body
  const valid = await Utils.validateSchema(res, addClientSchema, body)
  if (!valid) return
  const user = req.user as IUser
  const existingClient = await db.selectSingle(
    `select * from clients where email = $1`,
    [body.email]
  )
  if (existingClient) {
    return Utils.sendError(res, {
      status: "error",
      message: "Client with the same email already exists",
    })
  }
  const dbRes = await db.insert("clients", {
    name: body.name,
    email: body.email,
    company: body.company,
    phone: body.phone,
    address: body.address,
    user_id: user.id,
    city_id: body.city_id,
    currency_id: body.currency_id,
    ballance: body.ballance,
  })
  if (dbRes.error) {
    return Utils.sendError(res, dbRes.error.message)
  }
  Utils.sendSuccess(res, {
    client: dbRes.data,
  })
}
