import { Client } from "pg"

export const connectDB = async (): Promise<Client | undefined> => {
  const db = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT) || 5432,
  })

  try {
    await db.connect()
    console.log("DB connected")
    return db // Return the connected client
  } catch (error: any) {
    console.error("Error connecting to database", error.stack)
    return undefined
  }
}
