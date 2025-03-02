import { Request, Response } from "express"
import { IDbTools } from "../../../interfaces"
import Utils from "../../../utils"
import verifyEmailSchema from "./schema"
export default async function verifyEmail(req: Request, res: Response) {
  const db: IDbTools = req.app.locals.db
  const { error } = verifyEmailSchema.validate(req.body)
  const { verificationCode, email } = req.body
  if (error) {
    return Utils.sendError(res, {
      status: "message",
      message: error.details.map((item) => item.message),
    })
  }
  const currentDate = new Date()
  const existingUser: any = await db.selectSingle(
    `select * from users where email = $1`,
    [email]
  )
  if (!existingUser) {
    return Utils.sendError(res, {
      status: "error",
      message: `User not found`,
    })
  }
  if (
    existingUser.verificationtoken !== verificationCode ||
    currentDate > existingUser.verified
  ) {
    return Utils.sendError(res, {
      status: "error",
      message: "Verification failed",
    })
  }
  const dbRes = await db.update("users", {
    verificationtoken: null,
    verified: null,
    isverified: true,
    id: existingUser.id,
  })
  if (dbRes.error) {
    return Utils.sendError(res, dbRes.error.message)
  }
  Utils.sendSuccess(res, "You have been successfully verified")
}
