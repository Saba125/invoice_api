import { Request, Response } from "express"
import { IDbTools } from "../../../interfaces"
import Utils from "../../../utils"
export default async function aboutMe(req: Request, res: Response) {
  const db: IDbTools = req.app.locals.db
  const user: any = req.user
  Utils.sendSuccess(res, {
    user,
  })
}
