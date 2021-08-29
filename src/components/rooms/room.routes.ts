import { Request, Response, Router } from 'express'
import { format } from 'date-fns'

import { getBusyRooms, getEventsForRoom, getUsageData } from './room.service'
import { ROOMS } from '../../util/constants'
import { asyncWrapper } from '../../util/asyncWrapper'

export const index = asyncWrapper(async (req: Request, res: Response) => {
  const busyRooms = await getBusyRooms()
  const usageData = await getUsageData()
  res.render('room/index', { busyRooms, ROOMS, format, usageData })
})

const show = asyncWrapper(async (req: Request, res: Response) => {
  if (+req.params.id <= 18 && +req.params.id >= 3) {
    res.render('room/calendar', { room: req.params.id, ROOMS })
  } else {
    res.status(404).redirect('/not-found')
  }
})

const getGroupsForRoom = asyncWrapper(async (req: Request, res: Response) => {
  const events = await getEventsForRoom(+req.params.id)
  res.json(
    events.map(event => ({
      title: event.name,
      start: event.startDate,
      end: event.endDate,
      groupId: event.id
    }))
  )
})

const router = Router()

router.get('/', index)
router.get('/:id', show)
router.get('/:id/events', getGroupsForRoom)

export default router
