import { Request, Response, NextFunction } from 'express'

import { User } from './user'

interface OAuthUser {
  displayName: string
  internal_id: string
  mail: string
}

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  const user = await User.query()
    .findOne({ id: parseInt(req.params.id) })
    .withGraphFetched('groups')

  if (!user) {
    res.redirect('error/not-found')
  } else {
    req.userToShow = user
    next()
  }
}

export const toggleAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const user = await User.query().findOne({ id: parseInt(req.params.id) })

  if (!user) {
    res.redirect('/not-found')
  } else {
    await User.query()
      .patch({ admin: !user.admin })
      .where({ id: user.id })
    next()
  }
}

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  await User.query()
    .patch({ ...req.body })
    .findById((req.user as User).id)

  next()
}

export const createUser = async (user: OAuthUser) => {
  return await User.transaction(async trx => {
    return await User.query(trx)
      .insert(
        {
          name: user.displayName,
          email: user.mail,
          authSchId: user.internal_id,
          admin: false
        }
      )
  })
}
