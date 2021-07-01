import { User } from '../components/users/user'
import { agenda } from './agendaJobs'

export interface Email {
  subject: string
  body: string
  link?: string
  linkTitle?: string
}

export const sendEmail = async (recipients: User[], email: Email) => {
  if (process.env.NODE_ENV === 'production') {
    await agenda.now('send email', {
      users: recipients,
      email: email
    })
  }
}
