import { sendEmail } from '../util/sendEmail'
import { Agenda } from 'agenda/es'

export const agenda = new Agenda({ db: { address: 'mongodb://127.0.0.1:27017' } })

agenda.define('send email', async (job) => {
  await sendEmail(job.attrs.data.users, job.attrs.data.email)
})
