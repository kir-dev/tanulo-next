import { Group } from '../groups/group'

export const getBusyRooms = async () => {
  const currentTime = new Date()
  return (await Group.query()
    .where('startDate', '<', currentTime)
    .andWhere('endDate', '>', currentTime))
    ?.map(group => ({
      id: group.room,
      groupId: group.id,
      doNotDisturb: group.doNotDisturb
    }))
}

export const getEventsForRoom = async (roomId: number) =>
  await Group.query().where({ room: roomId })
