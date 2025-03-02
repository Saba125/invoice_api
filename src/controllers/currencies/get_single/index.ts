import { Request, Response } from "express"
import { IDbTools, IUser } from "../../../interfaces"
import Utils from "../../../utils"
export default async function get_single_currency(req: Request, res: Response) {
  const db: IDbTools = req.app.locals.db
  const id = parseInt(req.params.id)
  const dbRes = await db.selectSingle(
    `select c.*, cv.currency_rate as currency_rate, cv.currency_date as currency_date from currencies c left join currency_value cv on c.id = cv.currency_id where c.id = $1`,
    [id]
  )
  Utils.sendSuccess(res, {
    currency: dbRes,
  })
}
