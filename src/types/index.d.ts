import { Group } from '../entity/group.entity'
import { Ticket } from '../tickets/ticket.entity'
import { User as LocalUser } from '../users/user.entity'

declare global {
  namespace Express {
    interface Request {
      tickets: Ticket[]
      ticket: Ticket
      groups: Group[]
      group: Group
      userToShow: LocalUser
    }
  }
}
