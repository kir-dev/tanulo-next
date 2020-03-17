import { Request, Response } from 'express'

import { User } from '../entity/user.entity'
import { getUser } from '../services/user.service'

export const show = async (req: Request, res: Response) => {
  const otherUser = await getUser(
    {
      where: { id: +req.params.id },
      relations: ['groups']
    })

  if (!otherUser) return res.redirect('/not-found')
  res.render('user/show', {
    otherUser,
    user: req.user
  })
}

export const showMe = async (req: Request, res: Response) => {
  res.render('user/show', {
    otherUser: (await getUser(
      {
        where: { id: (req.user as User).id },
        relations: ['groups']
      })),
    user: req.user
  })
}

export const toggleAdmin = async (req: Request, res: Response) => {
  const result = await User.toggleAdmin(+req.params.id)

  if (!result) return res.redirect('/not-found')
  res.redirect(`/users/${req.params.id}`)
}
