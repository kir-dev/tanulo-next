import { Request, Response, NextFunction} from 'express'

import { Group } from './group.entity'
import { User } from '../users/user.entity'

export const getGroups = async (req: Request, res: Response, next: NextFunction) => {
  req.groups = await Group.find({ order: { createdAt: 'DESC' } })
  next()
}

export const getGroup = async (req: Request, res: Response, next: NextFunction) => {
  const group = await Group.findOne(
    {
      relations: ['users', 'owner'],
      where: { id: parseInt(req.params.id) }
    }
  )
  if (group) {
    req.group = group
    next()
  } else {
    res.render('error/not-found')
  }
}

export const createGroup = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as User
  const newGroup = Group.create()
  newGroup.name = req.body.name
  newGroup.room = req.body.room
  newGroup.owner = user
  newGroup.users = [user]
  newGroup.description = req.body.description
  newGroup.subject = req.body.subject
  newGroup.doNotDisturb = !!req.body.doNotDisturb
  newGroup.startDate = req.body.startDate
  newGroup.endDate = req.body.endDate
  await newGroup.save()
  next()
}

export const removeGroup = async (req: Request, res: Response, next: NextFunction) => {
  await Group.remove(req.group)
  next()
}
