import { Request, Response, NextFunction } from 'express'

import { asyncWrapper } from '../../util/asyncWrapper'
import { prisma } from '../../prisma'
import { Prisma, RoleType, User } from '@prisma/client'

interface OAuthUser {
  displayName: string
  internal_id: string
  mail: string
}

export const getUser = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
  const user = await prisma.user.findFirst({
    where: { id: parseInt(req.params.id) },
    include: { groups: { include: { group: true } } },
  })

  if (!user) {
    res.status(404).render('error/not-found')
  } else {
    req.userToShow = user
    next()
  }
})

export const updateRole = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
  try {
    await prisma.user.update({
      where: { id: parseInt(req.params.id) },
      data: { role: req.body.role },
      select: { id: true },
    })
    next()
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === '2025') {
      res.status(404).redirect('/not-found')
    } else {
      throw err
    }
  }
})

export const updateUser = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
  const id = req.user.id
  const { floor, wantEmail } = req.body
  req.user = await prisma.user.update({
    where: { id },
    data: { floor, wantEmail }
  })

  next()
})

export const createUser = async (user: OAuthUser): Promise<User> => {
  return prisma.user.create({
    data: {
      name: user.displayName,
      email: user.mail,
      authSchId: user.internal_id,
      role: RoleType.User
    }
  })
}
