import { Ticket } from '../tickets/ticket.entity'
import { Group } from '../entity/group.entity'

declare global {
  namespace Express {
    interface Request {
      tickets: Ticket[]
      ticket: Ticket
      groups: Group[]
      group: Group
    }
  }
}
