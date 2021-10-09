import { PaginationOptions } from '../components/groups/paginationOptions'
import { Prisma, PrismaClient, User as LocalUser, Group, Ticket, Membership } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      otherTickets: Ticket[]
      myTickets: Ticket[]
      groups: Group[]
      paginationOptions: PaginationOptions
      group: Group & {
        users: Membership[];
      }
      userToShow: LocalUser
    }

    interface User extends LocalUser { }
  }
}

declare module 'express-session' {
  interface SessionData {
    returnTo: string
  }
}
