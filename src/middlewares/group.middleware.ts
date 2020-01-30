import { Request, Response, NextFunction } from 'express'
import { getGroup } from '../services/group.service'
import { User } from '../entity/User'

export const isGroupOwner = async (req: Request, res: Response, next: NextFunction) => {
  const group = await getGroup(+req.params.id)
  if ((req.user as User).id === group.owner.id) {
    res.locals.group = group
    next()
  } else {
    res.render('error/forbidden')
  }
}
