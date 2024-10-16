import { Request, Response, NextFunction } from 'express'

import { RoleType, User } from './user'
import { asyncWrapper } from '../../util/asyncWrapper'

interface OAuthUser {
  name: string
  sub: string
  email?: string
}

export const getUser = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.query()
      .findOne({ id: parseInt(req.params.id) })
      .withGraphFetched('groups(orderByEndDate)')
      .modifiers({
        orderByEndDate(builder) {
          builder.orderBy('endDate', 'DESC')
        },
      })

    if (!user) {
      res.render('error/not-found')
    } else {
      req.userToShow = user
      next()
    }
  }
)

export const updateRole = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.query().findOne({ id: parseInt(req.params.id) })

    if (!user) {
      res.redirect('/not-found')
    } else {
      await User.query().patch({ role: req.body.role }).where({ id: user.id })
      next()
    }
  }
)

export const updateUser = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.user.id
    const { floor, wantEmail } = req.body
    req.user = await User.query().patchAndFetchById(id, { floor, wantEmail })

    next()
  }
)

export const createUser = async (user: OAuthUser): Promise<User> => {
  return await User.transaction(async (trx) => {
    return await User.query(trx).insert({
      name: user.name,
      email: user.email,
      authSchId: user.sub,
      role: RoleType.USER,
    })
  })
}
