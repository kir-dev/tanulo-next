import { startOfDay, addDays, addWeeks, differenceInDays } from 'date-fns'
import { DAYS_OF_WEEK, ROOMS } from '../../util/constants'
import { RawUsageData } from './rawusagedata'
import { prisma } from '../../prisma'
import { Group } from '@prisma/client'

type ParsedUsageData = Map<number, {
  day: typeof DAYS_OF_WEEK[number]
  count: number
}[]>

export const getBusyRooms = async (): Promise<Group[]> => {
  const currentTime = new Date()
  return await prisma.group.findMany({
    where: {
      startDate: { lt: currentTime },
      endDate: { gt: currentTime }
    }
  })
}

export const getEventsForRoom = async (roomId: number): Promise<Group[]> =>
  await prisma.group.findMany({ where: { room: roomId } })

const fetchUsageData = async (start: Date, end: Date) => {
  //! unhandled case:
  // meeting starts before midnight, ends after
  // The event will not be registrated for the next day

  return []
  // TODO
  // .query()
  // .select('room')
  // .select({ day: raw('date(start_date)') })
  // .count()
  // .where('endDate', '>=', start)
  // .andWhere('startDate', '<', end)
  // .groupBy('room')
  // .groupBy('day') as Promise<RawUsageData[]>
}

const parseUsageData = (rawData: RawUsageData[], today: Date): ParsedUsageData => {

  const result = new Map<number, { day: typeof DAYS_OF_WEEK[number], count: number }[]>()

  // generate empty data
  for (const room of ROOMS) {
    const roomResult = DAYS_OF_WEEK.map((_, d) => ({
      day: DAYS_OF_WEEK[addDays(today, d).getDay()],
      count: 0
    }))
    result.set(room, roomResult)
  }

  // fill data
  for (const { room, day, count } of rawData) {
    const daysUntil = differenceInDays(day, today)
    if (room) {
      result.get(room)[daysUntil].count = Number(count)
    }
  }

  return result
}

/**
 * Usage data for the next seven days for all rooms
 */
export const getUsageData = async (): Promise<ParsedUsageData> => {
  const now = new Date()
  const today = startOfDay(now)
  const usageData = await fetchUsageData(now, addWeeks(today, 1))
  return parseUsageData(usageData, today)
}
