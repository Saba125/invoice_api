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
