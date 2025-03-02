import { Request, Response, NextFunction } from "express"
import Utils from "../utils"

export default function roleMiddleware(
  requiredRole: string,
  secondRequiredRole?: string
) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const user: any = req.user
      const rolesArray = [requiredRole, secondRequiredRole]
      if (rolesArray.includes(user.role)) {
        return next()
      } else {
        console.log(`You are not authorized as a ${requiredRole}`)
        Utils.sendError(
          res,
          {
            status: "error",
            message: `You are not authorized as a ${requiredRole}`,
          },
          403
        )
        return
      }
    } catch (error) {
      console.error(`${requiredRole} verification error:`, error)

      return Utils.sendError(
        res,
        {
          status: "error",
          message: "Invalid or expired token",
        },
        403
      )
    }
  }
}
