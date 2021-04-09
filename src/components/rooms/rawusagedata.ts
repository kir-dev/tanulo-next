import { Group } from '../groups/group'

/**
 * The number of events in a room on a given day
 */
export class RawUsageData extends Group {
  room: number
  day: Date
  many: number | string
}
