import { Request, Response, NextFunction } from 'express'

import { User } from './user.entity'

interface OAuthUser {
  displayName: string
  internal_id: string
  mail: string
}

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  const user = await User.findOne(
    {
      where: { id: +req.params.id },
      relations: ['groups']
    })

  if (!user) {
    res.redirect('error/not-found')
  } else {
    req.userToShow = user
    next()
  }
}

export const toggleAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const result = await User.toggleAdmin(+req.params.id)

  if (!result) {
    res.redirect('/not-found')
  } else {
    next()
  }
}

export const createUser = async (user: OAuthUser) => {
  const newUser = User.create()
  newUser.name = user.displayName
  newUser.authSchId = user.internal_id
  newUser.email = user.mail
  newUser.admin = false
  return await newUser.save()
}
