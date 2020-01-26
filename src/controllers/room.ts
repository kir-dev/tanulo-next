import { Request, Response } from 'express'

import { getBusyRooms, getEventsForRoom } from '../services/room.service'
import { ROOMS } from '../util/constants'

export const index = async (_req: Request, res: Response) => {
  const busyRooms = await getBusyRooms()
  res.render('room/index', { busyRooms, ROOMS })
}

export const show = async (req: Request, res: Response) => {
  if (+req.params.id <= 18 && +req.params.id >= 3) {
    res.render('room/calendar', { room: req.params.id })
  } else {
    res.redirect('/not-found')
  }
}

export const getGroupsForRoom = async (req: Request, res: Response) => {
  const events = await getEventsForRoom(+req.params.id)
  res.json(
    events.map(event => ({
      title: event.name,
      start: event.startDate,
      end: event.endDate,
      groupId: event.id
    }))
  )
}
