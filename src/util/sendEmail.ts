import transporter from '../config/email'
import { User } from '../components/users/user'
import { generateEmailHTML } from './emailTemplate'

export interface Email {
  subject: string
  body: string
  link?: string
  linkTitle?: string
}

export const sendEmail = (recipients: User[], email: Email) => {
  if (process.env.NODE_ENV === 'production') {
    recipients.filter(user => user.wantEmail).forEach(user => {
      transporter.sendMail({
        from: `TanulóSCH <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: email.subject,
        text: email.body,
        html: generateEmailHTML(user.name, email)
      }, (err) => {
        if (err) {
          console.log(err)
        }
      })
    })
  }
}
