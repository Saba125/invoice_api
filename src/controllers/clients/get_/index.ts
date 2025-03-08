import { Request, Response } from "express"
import { IDbTools, IUser } from "../../../interfaces"
import Utils from "../../../utils"
export default async function get_clients(req: Request, res: Response) {
  const db: IDbTools = req.app.locals.db
  const user = req.user as IUser
  const body = req.body
  const search = body.name ? `%${body.name}%` : `%`
  const dbRes = await db.select(
    `select 
        c.name, 
        c.email, 
        c.company, 
        c.phone, 
        c.address, 
        city.name as city_name, 
        currencies.is_default, 
        currencies.currency_name as curr_name, 
        currencies.code as curr_code, 
        currencies.symbol as curr_symbol,
        currencies.currency_rate as curr_rate
      from clients c
      left join city on city.id = c.city_id
      left join currencies on currencies.id = c.currency_id
      where c.user_id = $1 and c.name ILIKE $2
      `,

    [user.id, search]
  )
  Utils.sendSuccess(res, {
    client: dbRes.list,
  })
}
