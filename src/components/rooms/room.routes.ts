import { Request, Response, Router } from 'express'

import { getBusyRooms, getEventsForRoom } from './room.service'
import { ROOMS } from '../../util/constants'

export const index = async (req: Request, res: Response) => {
  const busyRooms = await getBusyRooms()
  res.render('room/index', { busyRooms, ROOMS, user: req.user })
}

const show = async (req: Request, res: Response) => {
  if (+req.params.id <= 18 && +req.params.id >= 3) {
    res.render('room/calendar', { room: req.params.id })
  } else {
    res.redirect('/not-found')
  }
}

const getGroupsForRoom = async (req: Request, res: Response) => {
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

const router = Router()

router.get('/', index)
router.get('/:id', show)
router.get('/:id/events', getGroupsForRoom)

export default router
