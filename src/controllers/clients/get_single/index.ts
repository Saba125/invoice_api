import { Request, Response } from "express"
import { IDbTools, IUser } from "../../../interfaces"
import Utils from "../../../utils"
export default async function get_single_client(req: Request, res: Response) {
  const id = parseInt(req.params.id)
  const db: IDbTools = req.app.locals.db
  const dbRes = await db.selectSingle(
    `
    select 
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
      where c.id = $1
    `,
    [id]
  )
  if (!dbRes) {
    return Utils.sendError(res, `Client with id ${id} is not found`)
  }
  Utils.sendSuccess(res, {
    client: dbRes,
  })
}
