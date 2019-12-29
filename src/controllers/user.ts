import { Request, Response } from 'express'

import { User } from '../entity/User'
import '../config/passport'

const getUser = async(id: number) => {
  return (await User.find({
    relations: ['groups'],
    where: { id }
  }))[0]
}

/**
 * GET /logout
 * Log out.
 */
export const logout = (req: Request, res: Response) => {
  req.logout()
  res.redirect('/')
}

export const showUser = async(req: Request, res: Response) => {
  res.render('user/show', {
    otherUser: (await getUser(+req.params.id)),
    user: req.user
  })
}

export const showCurrentUser = async(req: Request, res: Response) => {
  res.render('user/show', {
    otherUser: (await getUser((req.user as User).id)),
    user: req.user
  })
}

export const toggleAdmin = async(req: Request, res: Response) => {
  await User.toggleAdmin(+req.params.id)
  res.redirect(`/users/${req.params.id}`)
}
