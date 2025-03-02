import { Request, Response } from "express"
import { IDbTools } from "../../../interfaces"
import Utils from "../../../utils"
export default async function get_single_city(req: Request, res: Response) {
  const id = parseInt(req.params.id)
  const db: IDbTools = req.app.locals.db
  const dbRes = await db.selectSingle(`select * from city where id = $1`, [id])
  if (!dbRes) {
    return Utils.sendError(res, {
      status: "error",
      message: `City with id ${id} is not found`,
    })
  }
  Utils.sendSuccess(res, {
    city: dbRes,
  })
}
