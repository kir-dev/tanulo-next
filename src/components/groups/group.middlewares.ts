import { NextFunction, Request, Response } from 'express'

import { User } from '../users/user'
import { Group } from './group'

export const joinGroup = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as User
  const group = req.group

  if (!group.users?.includes(user)) {
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
    .where('id', (req.user as User).id)

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
