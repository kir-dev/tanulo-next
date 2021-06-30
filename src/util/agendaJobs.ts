import { sendEmail } from '../util/sendEmail'
import { Agenda } from 'agenda/es'

export const agenda = new Agenda({ db: { address: process.env.MONGO_CONNECTION } })

agenda.define('send email', async (job) => {
  await sendEmail(job.attrs.data.users, job.attrs.data.email)
})
