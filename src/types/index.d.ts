import { Group } from '../components/groups/group'
import { Ticket } from '../components/tickets/ticket'
import { User as LocalUser } from '../components/users/user'
import { PaginationOptions } from '../components/groups/paginationOptions'

declare global {
  namespace Express {
    interface Request {
      tickets: Ticket[]
      groups: Group[]
      paginationOptions: PaginationOptions
      group: Group
      userToShow: LocalUser
    }
  }
}
