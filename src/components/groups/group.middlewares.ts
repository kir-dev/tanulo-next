import { NextFunction, Request, Response } from 'express'
import * as ics from 'ics'
import { writeFileSync } from 'fs'
import winston from 'winston'

import { User } from '../users/user'
import { Group } from './group'

export const joinGroup = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as User
  const group = req.group

  //Join group if not already in it, and it's not closed or it's the owner who joins.
  if ((!group.doNotDisturb || (user.id === group.ownerId)) && !group.users?.includes(user)) {
    await Group.relatedQuery('users')
      .for(group.id)
      .relate(user.id)
  }
  next()
}

export const leaveGroup = async (req: Request, res: Response, next: NextFunction) => {
  const group = req.group
  await Group.relatedQuery('users')
    .for(group.id)
    .unrelate()
    .where('user_id', (req.user as User).id)

  next()
}

export const isGroupOwner = async (req: Request, res: Response, next: NextFunction) => {
  const group = req.group

  if ((req.user as User)?.id === group.ownerId) {
    next()
  } else {
    res.render('error/forbidden')
  }
}

export const createICSEvent = (req: Request, res: Response) => {
  const group = req.group
  const { startDate, endDate } = group

  const event: ics.EventAttributes = {
    title: group.name,
    description: group.description,
    start: [
      startDate.getFullYear(),
      startDate.getMonth() + 1,
      startDate.getDate(),
      startDate.getHours(),
      startDate.getMinutes()
    ],
    end: [
      endDate.getFullYear(),
      endDate.getMonth() + 1,
      endDate.getDate(),
      endDate.getHours(),
      endDate.getMinutes()
    ],
    location: `SCH ${group.room.toString()}. emeleti tanuló`,
    url: `https://tanulo.sch.bme.hu/groups/${group.id}`,
    categories: group.tags ? group.tags.split(',') : null
  }

  ics.createEvent(event, (err, value) => {
    if (err) {
      winston.error(err.message)
      return res.status(500).send({ message: err.message })
    }
    const path = '/tmp/event.ics'

    try {
      writeFileSync(path, value)
      res.download(path)
    } catch (error) {
      winston.error(error.message)
      res.sendStatus(500)
    }
  })
}
