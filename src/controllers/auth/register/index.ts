import { Request, Response } from "express"
import { IDbTools } from "../../../interfaces"
import registerSchema from "./schema"
import Utils from "../../../utils"
import { send_register_email } from "../../../mail"
export default async function register(req: Request, res: Response) {
  const db: IDbTools = req.app.locals.db
  const { email, password, name } = req.body
  const hashedPassword = Utils.getCryptoHash(password)
  const { error } = registerSchema.validate(req.body)
  if (error) {
    return Utils.sendError(res, {
      status: "error",
      message: error.details.map((item) => item.message),
    })
  }
  const checkEmail = await db.selectSingle(
    `select * from users where email = $1`,
    [email]
  )
  if (checkEmail) {
    return Utils.sendError(res, {
      status: "error",
      message: `User with that email already exists`,
    })
  }
  const dbRes = await db.insert("users", {
    name,
    email,
    password: hashedPassword,
  })
  if (dbRes.error) {
    return Utils.sendError(res, dbRes.error.message)
  }
  const token = Utils.createToken(dbRes.data)
  await send_register_email(dbRes.data.email, "Registration", "Welcome!")
  Utils.sendSuccess(res, {
    user: dbRes.data,
    token,
  })
}
