import express, { Request, Response } from "express"
import dotenv from "dotenv"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import rateLimiter from "express-rate-limit"
import cookieParser from "cookie-parser"
import router from "./routes/routes"
import path from "path"
import { Client } from "pg"
import authMiddleware from "./middlewares/auth"
import adminMiddleware from "./middlewares/permission"
import { connectDB } from "./controllers/invoices/db_connection"
// Load environment variables from .env file
import DbTools from "./db/db_tools"
import generate_inv_number from "./utils/generate_inv_number"
const app = express()
dotenv.config()
const corsOptions = {
  origin: true,
  credentials: true,
  optionsSuccessStatus: 200,
}
// Middlewares
app.use(express.json())
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(cors(corsOptions))
app.use(morgan("dev"))
app.use(helmet())
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
)
// Db Connect
// Serve static files
app.use("/images", express.static(path.join(__dirname, "../../public/images")))
app.use("/videos", express.static(path.join(__dirname, "../../public/videos")))
app.set("view engine", "pug")
app.set("views", path.join(__dirname, "mail/templates")) // Ensure your Pug templates are inside a "views" folder

// Routes

app.use("/api/v1", router)
const PORT = process.env.PORT || 3000
const test = generate_inv_number(9, "INV-")
console.log(test)
// Run app

app.listen(PORT, async () => {
  try {
    const db = await connectDB()
    app.locals.db = DbTools

    console.log(`Server is running on port ${PORT}`)
  } catch (error) {
    console.error("Failed to connect to the database", error)
  }
})
