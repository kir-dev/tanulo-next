import { Request, Response, NextFunction } from 'express'
import { User } from '../users/user.entity'

export const joinGroup = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as User
  const group = req.group
  if (!group.doNotDisturb && group.users.includes(user)) {
    group.users.push(user)
    await group.save()
  }
  next()
}

export const leaveGroup = async (req: Request, res: Response, next: NextFunction) => {
  const group = req.group
  group.users = group.users.filter(user => user.id !== (req.user as User).id)
  await group.save()
  next()
}

export const isGroupOwner = async (req: Request, res: Response, next: NextFunction) => {
  const group = req.group
  if ((req.user as User)?.id === group.owner.id) {
    next()
  } else {
    res.render('error/forbidden')
  }
}
