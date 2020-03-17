import { LessThan, MoreThan } from 'typeorm'

import { Group } from '../entity/group.entity'

export const getBusyRooms = async () => {
  const currentTime = new Date()
  return (await Group.find({
    where: [
      {
        startDate: LessThan(currentTime),
        endDate: MoreThan(currentTime)
      },
    ]
  }))?.map(group => ({
    id: group.room,
    groupId: group.id,
    doNotDisturb: group.doNotDisturb
  }))
}

export const getEventsForRoom = async (roomId: number) =>
  await Group.find({ where: { room: roomId } })
