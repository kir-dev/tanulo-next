import { Request, Response, NextFunction } from 'express'
import { getGroup } from '../services/group.service'
import { User } from '../users/user.entity'

export const isGroupOwner = async (req: Request, res: Response, next: NextFunction) => {
  const group = await getGroup(+req.params.id)
  if (!group) { res.render('error/not-found')}
  if ((req.user as User)?.id === group.owner.id) {
    res.locals.group = group
    next()
  } else {
    res.render('error/forbidden')
  }
}
