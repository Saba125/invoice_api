import { IDbResponse, IDbTools } from "../interfaces"
import { Pool } from "pg"
import dotenv from "dotenv"
dotenv.config()
const pool = new Pool({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || "5432"),
})
/**
 * Executes a SELECT query and returns an array of results.
 */
const DbTools: Partial<IDbTools> = {
  async select(query: string, params: any[] = []): Promise<IDbResponse> {
    const client = await pool.connect()
    try {
      const res = await client.query(query, params)
      return { list: res.rows || [] }
    } catch (error: any) {
      console.error("select error:", error.message)
      return { error: { message: error.message } }
    } finally {
      client.release()
    }
  },

  async selectSingle(
    query: string,
    params: any[] = []
  ): Promise<unknown | null> {
    if (!DbTools.select) {
      throw new Error("DbTools.select is not defined.")
    }
    const dbRes: IDbResponse | null = await DbTools.select(query, params)
    return dbRes?.list?.length ? dbRes.list[0] : null
  },

  async insert(
    table: string,
    data: Record<string, any> // Accepts an object of key-value pairs
  ): Promise<IDbResponse> {
    const client = await pool.connect()
    try {
      // Validate input
      if (!table || typeof table !== "string") {
        throw new Error("Invalid table name")
      }
      if (!data || Object.keys(data).length === 0) {
        throw new Error("Data object cannot be empty")
      }

      // Extract columns and values from the data object
      const columns = Object.keys(data)
      const values = Object.values(data)

      // Generate placeholders for the query (e.g., $1, $2, $3)
      const placeholders = values.map((_, i) => `$${i + 1}`).join(", ")

      // Construct the SQL query
      const query = `
      INSERT INTO ${table} (${columns.join(", ")})
      VALUES (${placeholders})
      RETURNING *  -- Return all columns of the inserted row
    `

      // Execute the query
      const res = await client.query(query, values)

      // Return the inserted row as an object
      return { data: res.rows[0] || null } // Use `data` to return the inserted row
    } catch (error: any) {
      console.error("insert error:", error.message)
      return { error: { message: error.message } }
    } finally {
      client.release()
    }
  },
  async queryNonResponse(
    query: string,
    params: any[] = []
  ): Promise<IDbResponse> {
    const client = await pool.connect()
    try {
      await client.query(query, params)
      return {}
    } catch (error: any) {
      console.error("queryNonResponse error:", error.message)
      return { error: { message: error.message } }
    } finally {
      client.release()
    }
  },

  async update(
    table_name: string, // Table name
    params: Record<string, any> // Data to update, including the WHERE clause parameter
  ): Promise<IDbResponse> {
    const client = await pool.connect()
    try {
      // Validate input
      if (!table_name || typeof table_name !== "string") {
        throw new Error("Invalid table name")
      }
      if (!params || Object.keys(params).length === 0) {
        throw new Error("Params object cannot be empty")
      }

      // Determine the WHERE clause key (either 'currency_id' or 'id')
      const whereKey = params.currency_id ? "currency_id" : "id"
      const whereValue = params[whereKey]

      if (!whereValue) {
        throw new Error(`Missing WHERE clause parameter: ${whereKey}`)
      }

      // Remove the WHERE clause parameter from the params object
      const { [whereKey]: _, ...updateParams } = params

      // Extract columns and values from the updateParams object
      const columns = Object.keys(updateParams)
      const values = Object.values(updateParams)

      if (columns.length === 0) {
        throw new Error("No update fields provided")
      }

      // Generate the SET clause for the query (e.g., "column1 = $1, column2 = $2")
      const setClause = columns
        .map((col, index) => `${col} = $${index + 1}`)
        .join(", ")

      // Construct the SQL query
      const query = `
      UPDATE ${table_name}
      SET ${setClause}
      WHERE ${whereKey} = $${
        columns.length + 1
      } -- Use the WHERE clause parameter
      RETURNING *;
    `

      // Combine the update values and WHERE clause parameter
      const queryParams = [...values, whereValue]

      // Execute the query
      const res = await client.query(query, queryParams)

      // Return the updated row(s) as an object or list
      if (res.rows.length === 1) {
        return { data: res.rows[0] } // Return a single object if one row is updated
      } else if (res.rows.length > 1) {
        return { list: res.rows } // Return a list if multiple rows are updated
      } else {
        return { data: null } // Return null if no rows are updated
      }
    } catch (error: any) {
      console.error("update error:", error.message)
      return { error: { message: error.message } }
    } finally {
      client.release()
    }
  },

  async delete(
    table_name: string, // Table name
    params: Record<string, any> // Parameters for the WHERE clause
  ): Promise<IDbResponse> {
    const client = await pool.connect()
    try {
      // Validate input
      if (!table_name || typeof table_name !== "string") {
        throw new Error("Invalid table name")
      }
      if (!params || Object.keys(params).length === 0) {
        throw new Error("Params object cannot be empty")
      }

      // Extract the WHERE clause key and value
      const whereKey = Object.keys(params)[0] // Use the first key as the WHERE clause
      const whereValue = params[whereKey]

      if (!whereValue) {
        throw new Error(`Missing WHERE clause parameter: ${whereKey}`)
      }

      // Construct the SQL query
      const query = `
      DELETE FROM ${table_name}
      WHERE ${whereKey} = $1
      RETURNING *;  -- Return the deleted row(s)
    `

      // Execute the query
      const res = await client.query(query, [whereValue])

      // Return the deleted row(s) as an object or list
      if (res.rows.length === 1) {
        return { data: res.rows[0] } // Return a single object if one row is deleted
      } else if (res.rows.length > 1) {
        return { list: res.rows } // Return a list if multiple rows are deleted
      } else {
        return { data: null } // Return null if no rows are deleted
      }
    } catch (error: any) {
      console.error("delete error:", error.message)
      return { error: { message: error.message } }
    } finally {
      client.release()
    }
  },
}

export default DbTools as IDbTools
