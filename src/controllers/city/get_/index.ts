import { Request, Response } from "express"
import { IDbTools } from "../../../interfaces"
import Utils from "../../../utils"
export default async function get_cities(req: Request, res: Response) {
  const db: IDbTools = req.app.locals.db
  const body = req.body
  const search = `%${body.search}%`
  const dbRes = await db.select(`select * from city where name LIKE $1`, [
    search,
  ])
  Utils.sendSuccess(res, {
    city: dbRes.list,
  })
}
