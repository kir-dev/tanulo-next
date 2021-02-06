/**
 * Converts time to date (trims hours, mins, secs, ms)
 */
export function toDate(now: Date) {
  const d = new Date(now)
  d.setHours(0)
  d.setMinutes(0)
  d.setSeconds(0)
  d.setMilliseconds(0)
  return d
}

export function addOneWeek(d: Date) {
  const ONE_WEEK = 7 * 24 * 60 * 60 * 1000
  return new Date(d.getTime() + ONE_WEEK)
}
