import { Agenda } from 'agenda/es'
import transporter from '../config/email'
import { generateEmailHTML } from './emailTemplate'

export const agenda = (process.env.NODE_ENV === 'production') ?
  new Agenda({ db: {
    address: 'mongodb://127.0.0.1:27017',
    useUnifiedTopology: true }
  })
  : null

if (process.env.NODE_ENV === 'production') {
  agenda.define('send email', async (job) => {
    job.attrs.data.users.filter(user => user.wantEmail).forEach(user => {
      transporter.sendMail({
        from: `TanulóSCH <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: job.attrs.data.email.subject,
        text: job.attrs.data.email.body,
        html: generateEmailHTML(user, job.attrs.data.email)
      }, (err) => {
        if (err) {
          console.log(err)
        }
      })
    })
  })
}
