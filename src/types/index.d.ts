import { Group } from '../components/groups/group.entity'
import { Ticket } from '../components/tickets/ticket.entity'
import { User as LocalUser } from '../components/users/user.entity'

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
