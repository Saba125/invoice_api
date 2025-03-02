import nodemailer from "nodemailer"
export type SendEmailTypes = {
  to?: string
  subject?: string
  text?: string
  html?: string
}
export const createEtherealTransport = async () => {
  const testAccount = await nodemailer.createTestAccount()

  return nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  })
}

export const sendTestEmail = async ({
  html,
  subject,
  text,
  to,
}: SendEmailTypes) => {
  try {
    const transporter = await createEtherealTransport()
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USERNAME,
      to,
      subject,
      text,
      html,
    })

    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info))
  } catch (error) {
    console.error("Error sending email:", error)
  }
}
