import { Request, Response } from "express"
import { IDbTools } from "../../../interfaces"
import Utils from "../../../utils"
export default async function get_states(req: Request, res: Response) {
  const db: IDbTools = req.app.locals.db
  const dbRes = await db.select(
    `select s.*, c.name as city_name 
     from state as s 
     join city as c on s.city_id = c.id`
  )
  Utils.sendSuccess(res, {
    states: dbRes.list,
  })
}
