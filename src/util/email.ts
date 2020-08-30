import nodemailer from 'nodemailer'

const transport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_SENDER,
    pass: process.env.EMAIL_PASS
  }
})

export const sendMail = async (recipients: string | string[], subject: string, message: string) => {
  await transport.sendMail({
    from: process.env.EMAIL_SENDER,
    to: recipients,
    subject: `[tanulo] ${subject}`,
    html: message
  })
}
