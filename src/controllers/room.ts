import { Request, Response } from 'express'
import { LessThan, MoreThan } from 'typeorm'

import { Group } from '../entity/Group'
import { ROOMS } from '../util/constants'

const getBusyRooms = async () => {
  const currentTime = new Date()
  return (await Group.find({
    where: [
      {
        startDate: LessThan(currentTime),
        endDate: MoreThan(currentTime)
      },
    ]
  })).map(group => ({
    id: group.room,
    groupId: group.id,
    doNotDisturb: group.doNotDisturb
  }))
}

const getEventsForRoom = async (roomId: number) => {
  return await Group.find({ where: { room: roomId } })
}

export const getRooms = async (_req: Request, res: Response) => {
  const busyRooms = await getBusyRooms()
  res.render('room/index', { busyRooms, ROOMS })
}

export const getRoom = async (req: Request, res: Response) => {
  res.render('room/calendar', { room: req.params.id })
}

export const getGroupsForRoom = async (req: Request, res: Response) => {
  const events = await getEventsForRoom(+req.params.id)
  res.json(
    events.map(event => ({
      title: event.name,
      start: event.startDate,
      end: event.endDate,
      groupId: event.id
    })))
}
