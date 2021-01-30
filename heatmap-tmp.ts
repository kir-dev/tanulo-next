// This is a temprary code snippet
// to test a database request
// before integrating it into the application

import knexFactory from 'knex'

const knex = knexFactory({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'tanulo',
    password: 'tanulo',
    database: 'tanulo',
  }
})

/**
 * Converts time to date (trims hours, mins, secs, ms)
 */
function toDate(now: Date) {
  const d = new Date(now)
  d.setHours(0)
  d.setMinutes(0)
  d.setSeconds(0)
  d.setMilliseconds(0)
  return d
}

function addOneWeek(d: Date) {
  const ONE_WEEK = 7 * 24 * 60 * 60 * 1000
  return new Date(d.getTime() + ONE_WEEK)
}

/**
 * The number of events in a room on a given day 
 */
interface RawUsageData {
  room: number
  day: Date
  many: number | string
}

async function fetchUsageData(start: Date, end: Date): Promise<RawUsageData[]> {
  //! unhandled case:
  // meeting starts before monday midnight, ends after

  return knex
    .select('room')
    .select(knex.raw('date(start_date) as day'))
    .select(knex.raw('count(*) as many'))
    .from('groups')
    .where('start_date', '>=', start)
    .where('start_date', '<', end)
    .groupBy('room')
    .groupByRaw(knex.raw('date(start_date)'))
}

function parseUsageData(rawData: RawUsageData[], today: Date) {
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

async function main() {
  const now = new Date()
  const today = toDate(now)
  const nextWeek = addOneWeek(today)

  const usageData = await fetchUsageData(today, nextWeek)

  const data = parseUsageData(usageData, today)

  console.log('room => { daysUntil => many }')
  console.log(data)

  await knex.destroy()
}

main()
