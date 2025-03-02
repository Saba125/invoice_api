import { Request, Response } from "express"
import crypto from "crypto"
import jwt from "jsonwebtoken"
import Joi from "joi"
function getCryptoHash(data: string) {
  return crypto.createHash("sha256").update(data, "utf8").digest("hex")
}
function validateSchema(
  res: Response,
  schema: Joi.ObjectSchema<any>, // <-- Accept the schema object directly
  data: any
) {
  try {
    const { error } = schema.validate(data) // <-- No need to call schema()

    if (error) {
      const message = error.details[0].message
      sendError(res, message, 422)
      return false
    }

    return true
  } catch (err) {
    console.error("Validation or translation error:", err)
    sendError(res, "An unexpected error occurred during validation.", 500)
    return false
  }
}

async function sendSuccess(res: Response, data: any, status: number = 200) {
  try {
    const resp = typeof data === "string" ? { message: data } : data
    res.status(status).json(resp)
  } catch (error) {
    console.error("Error in sendSuccess:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}
async function sendError(res: Response, error: any, status: number = 500) {
  try {
    const errorMessage = typeof error === "string" ? { error: error } : error
    res.status(status).json(errorMessage)
  } catch (err) {
    console.error("Error in sendError:", err)
    res.status(500).json({ error: "Internal server error" })
  }
}
function createToken(user: any) {
  return jwt.sign({ user }, process.env.JWT_SECRET!, {
    expiresIn: "10d",
  })
}

const Utils = {
  getCryptoHash,
  createToken,
  sendSuccess,
  sendError,
  validateSchema,
}
export default Utils
