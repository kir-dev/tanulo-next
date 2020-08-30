import Agenda from 'agenda'

import notifyAdmins from '../jobs/new-ticket-notify'

const agenda = new Agenda({ db: { address: process.env.MONGO_URI } })

agenda.define('new-ticket-notify', notifyAdmins)

export default agenda
