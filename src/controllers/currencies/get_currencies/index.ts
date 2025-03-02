import { Request, Response } from "express"
import { IDbTools, IUser } from "../../../interfaces"
import Utils from "../../../utils"
export default async function get_currencies(req: Request, res: Response) {
  const db: IDbTools = req.app.locals.db
  const user = req.user as IUser
  const dbRes = await db.select(
    `select c.*, cv.currency_rate as currency_rate, cv.currency_date as currency_date from currencies c left join currency_value cv on c.id = cv.currency_id where c.user_id = $1`,
    [user.id]
  )
  Utils.sendSuccess(res, {
    currency: dbRes.list,
  })
}
