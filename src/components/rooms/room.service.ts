import { Group } from '../groups/group'
import { toDate, addOneWeek } from '../../util/time'
import { DAYS_OF_WEEK, ROOMS } from '../../util/constants'
import { RawUsageData } from './rawusagedata'

export const getBusyRooms = async () => {
  const currentTime = new Date()
  return (await Group.query()
    .where('startDate', '<', currentTime)
    .andWhere('endDate', '>', currentTime))
}

export const getEventsForRoom = async (roomId: number) =>
  await Group.query().where({ room: roomId })

const fetchUsageData = async (start: Date, end: Date) => {
  //! unhandled case:
  // meeting starts before midnight, ends after
  // The event will not be registrated for the next day

  return RawUsageData
    .query()
    .select('room')
    .select('startDate as day')
    .count('* as many')
    .where('endDate', '>=', start)
    .andWhere('startDate', '<', end)
    .groupBy('room')
    .groupBy('startDate') as Promise<RawUsageData[]>
}

const parseUsageData = (rawData: RawUsageData[], today: Date) => {

  const result = new Map<number, { day: typeof DAYS_OF_WEEK[number], many: number }[]>()

  // generate empty data
  for (const room of ROOMS) {
    const roomResult = DAYS_OF_WEEK.map((_, d) => ({
      day: DAYS_OF_WEEK[(today.getDay() + d -1) % 7],
      many: 0
    }))
    result.set(room, roomResult)
  }

  // fill data
  for (const { room, day, many } of rawData) {
    const daysUntil = (7 + day.getDay() - today.getDay()) % 7
    result.get(room)[daysUntil].many = Number(many)
  }

  return result
}

/**
 * Usage data for the next seven days for all rooms
 */
export const getUsageData = async () => {
  const now = new Date()
  const today = toDate(now)
  const usageData = await fetchUsageData(now, addOneWeek(today))
  return parseUsageData(usageData, today)
}
