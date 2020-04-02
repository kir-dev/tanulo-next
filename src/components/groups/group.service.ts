import { Request, Response, NextFunction} from 'express'

import { Group } from './group'
import { User } from '../users/user'

export const getGroups = async (req: Request, res: Response, next: NextFunction) => {
  req.groups = await Group.query().orderBy('createdAt', 'DESC')
  next()
}

export const getGroup = async (req: Request, res: Response, next: NextFunction) => {
  const group = await Group.query()
    .findOne({ id: parseInt(req.params.id) })
    .withGraphFetched('users')

  if (group) {
    req.group = group
    next()
  } else {
    res.render('error/not-found')
  }
}

export const createGroup = async (req: Request, res: Response, next: NextFunction) => {
  req.group = await Group.query()
    .insert(
      {
        name: req.body.name,
        subject: req.body.subject,
        room: parseInt(req.body.room),
        description: req.body.description,
        doNotDisturb: !!req.body.doNotDisturb,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        ownerId: (req.user as User).id
      }
    )

  next()
}

export const removeGroup = async (req: Request, res: Response, next: NextFunction) => {
  await Group.relatedQuery('users')
    .for(req.group.id)
    .unrelate()

  await Group.query().deleteById(req.group.id)

  next()
}