import { Request, Response } from 'express'

import { User } from '../entity/User'
import '../config/passport'

const getUser = async (id: number) => {
  return await User.findOne({
    relations: ['groups'],
    where: { id }
  })
}

export const logout = (req: Request, res: Response) => {
  req.logout()
  res.redirect('/')
}

export const showUser = async (req: Request, res: Response) => {
  const otherUser = await getUser(+req.params.id)

  if (!otherUser) return res.redirect('/not-found')
  res.render('user/show', {
    otherUser,
    user: req.user
  })
}

export const showCurrentUser = async (req: Request, res: Response) => {
  res.render('user/show', {
    otherUser: (await getUser((req.user as User).id)),
    user: req.user
  })
}

export const toggleAdmin = async (req: Request, res: Response) => {
  const result = await User.toggleAdmin(+req.params.id)

  if (!result) return res.redirect('/not-found')
  res.redirect(`/users/${req.params.id}`)
}
