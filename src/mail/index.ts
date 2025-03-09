import { join } from "path"
import pug from "pug"
import { sendTestEmail } from "./connection"

const templatesPath = join(__dirname, "templates")

export const send_register_email = async (
  to: string,
  subject: string,
  text: string,
  verificationUrl?: string
) => {
  const compiledTemplate = pug.compileFile(join(templatesPath, "register.pug"))

  const sendHtml = compiledTemplate({ subject, to, verificationUrl })

  return sendTestEmail({ to, subject, text, html: sendHtml })
}
export const send_order_confirmation_email = async (
  to: string,
  data: any,
  subject?: string,
  text?: string
) => {
  const compiledTemplate = pug.compileFile(
    join(templatesPath, "order_confirmation.pug")
  )
  const sendHtml = compiledTemplate({ data })

  return sendTestEmail({ to, subject, text, html: sendHtml })
}
export const send_invoice = async (
  to: string,
  data: any,
  subject?: string,
  text?: string
) => {
  const {
    invoice_number,
    company,
    create_date,
    due_date,
    items,
    total_price,
    note,
  } = data
  const compiledTemplate = pug.compileFile(join(templatesPath, "invoice.pug"))
  const sendHtml = compiledTemplate({
    invoice_number,
    company,
    create_date,
    due_date,
    items,
    total_price,
    note,
  })

  return sendTestEmail({ to, subject, text, html: sendHtml })
}
