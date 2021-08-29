import { StatusType, RoleType } from '@prisma/client'

export const ROOMS = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18] as const
export const DAYS_OF_WEEK = ['Va', 'Hé', 'Ke', 'Sze', 'Csü', 'Pé', 'Szo'] as const
export const DATE_FORMAT = 'yyyy-MM-dd HH:mm'

export const STATUSES = new Map<StatusType, string>([
  [StatusType.Sent, 'Elküldve'],
  [StatusType.InProgress, 'Folyamatban'],
  [StatusType.Done, 'Kész'],
  [StatusType.Archived, 'Archiválva']
])

export const ROLES = new Map<RoleType, string>([
  [RoleType.Admin, 'Admin'],
  [RoleType.TicketAdmin, 'Hibajegy admin'],
  [RoleType.User, 'Felhasználó'],
])
