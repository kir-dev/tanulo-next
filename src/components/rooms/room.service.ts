import { Group } from '../groups/group'
import { toDate, addOneWeek } from '../../util/time'
import { raw } from 'objection'

export const getBusyRooms = async () => {
  const currentTime = new Date()
  return (await Group.query()
    .where('startDate', '<', currentTime)
    .andWhere('endDate', '>', currentTime))
}

export const getEventsForRoom = async (roomId: number) =>
  await Group.query().where({ room: roomId })

/**
 * The number of events in a room on a given day
 */
interface RawUsageData {
  room: number
  day: Date
  many: number | string
}

const fetchUsageData =
  async (start: Date, end: Date) => {
    //! unhandled case:
    // meeting starts before midnight, ends after
    // The event will not be registrated for the next day

    return Group
      .query()
      .select('room')
      .select(raw('date(start_date) as day'))
      .select(raw('count(*) as many'))
      .where('startDate', '>=', start)
      .where('endDate', '<', end)
      .groupBy('room')
      .groupByRaw('date(start_date)')
      .groupByRaw('date(start_date)') as unknown as Promise<RawUsageData[]>
  }

/**
 * Convert the usage data from array to map
 */
const parseUsageData = (rawData: RawUsageData[], today: Date) => {
  const data = rawData.map(({ room, day, many }) => {
    return {
      daysUntil: (7 + day.getDay() - today.getDay()) % 7,
      many: Number.parseInt(many + ''),
      room,
    }
  })

  const result = new Map<number, Map<number, number>>()
  for (const { room, daysUntil, many } of data) {
    if (!result.has(room)) {
      result.set(room, new Map())
    }

    result.get(room).set(daysUntil, many)
  }

  return result
}

/**
 * Get the number of events in every room on the next seven days.
 *
 * The result doesn't include keys with zero events.
 * @returns Map<roomId, Map<dayOfWeekString, colorRGB>>
 */
export const getUsageData = async () => {
  const today = toDate(new Date())
  const usageData = await fetchUsageData(today, addOneWeek(today))
  return parseUsageData(usageData, today)
}
