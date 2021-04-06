export const ROOMS = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18] as const
export const DAYS_OF_WEEK = ['Hé', 'Ke', 'Sze', 'Csü', 'Pé', 'Szo', 'Va'] as const
export const DATE_FORMAT = 'yyyy-MM-dd HH:mm'

export const STATUSES = new Map<string, string>([
  ['SENT', 'Elküldve'],
  ['IN_PROGRESS', 'Folyamatban'],
  ['DONE', 'Kész'],
  ['ARCHIVED', 'Archiválva']
])

export const ROLES = new Map<string, string>([
  ['ADMIN', 'Admin'],
  ['TICKET_ADMIN', 'Hibajegy admin'],
  ['USER', 'Felhasználó'],
])
