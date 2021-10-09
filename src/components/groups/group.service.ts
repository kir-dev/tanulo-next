import { Request, Response, NextFunction } from 'express'

import { formatMdToSafeHTML } from '../../util/convertMarkdown'
import { asyncWrapper } from '../../util/asyncWrapper'
import { prisma } from '../../prisma'

export const getGroups = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
  const page = isNaN(Number(req.query.page)) ? 0 : Number(req.query.page)
  const limit = 20
  const endDate = req.query.past === 'true'
    ? { 'lt': new Date() }
    : { 'gte': new Date() }
  const [pageObject, total] = await prisma.$transaction([
    prisma.group.findMany({
      where: { endDate },
      orderBy: { startDate: 'asc' },
      take: limit,
      skip: page * limit,
    }),
    prisma.group.count({ where: { endDate } })
  ])
  req.groups = pageObject.map(group => {
    const raw = group.description.slice(0, 50) + (group.description.length > 50 ? ' ...' : '')
    group.description = formatMdToSafeHTML(raw)
    return group
  })

  req.paginationOptions = {
    pageNum: Math.ceil(total / limit),
    current: page
  }
  next()
})

export const getGroup = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
  const group = await prisma.group.findFirst({
    where: { id: parseInt(req.params.id) },
    include: { users: { include: { user: true } } }
  })

  if (group) {
    // Getting raw description for /copy and /edit pages
    if (!/\/copy|\/edit/.test(req.path)) {
      group.description = formatMdToSafeHTML(group.description)
    }
    req.group = group
    next()
  } else {
    res.status(404).render('error/not-found')
  }
})

export const createGroup = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
  const group = await prisma.group.create({
    data: {
      name: req.body.name,
      tags: req.body.tags ?? '',
      room: req.body.room ? parseInt(req.body.room) : null,
      link: req.body.link,
      place: req.body.place,
      description: req.body.description,
      doNotDisturb: !!req.body.doNotDisturb,
      startDate: new Date(req.body.startDate),
      endDate: new Date(req.body.endDate),
      ownerId: req.user.id,
      maxAttendees: parseInt(req.body.maxAttendees) || 100
    }
  })
  req.group = { users: [], ...group }
  next()
})

export const updateGroup = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
  await prisma.group.update({
    where: { id: parseInt(req.params.id) },
    data: {
      name: req.body.name,
      tags: req.body.tags ?? '',
      room: req.body.room ? parseInt(req.body.room) : null,
      link: req.body.link,
      place: req.body.place,
      description: req.body.description,
      doNotDisturb: !!req.body.doNotDisturb,
      startDate: new Date(req.body.startDate),
      endDate: new Date(req.body.endDate),
      maxAttendees: parseInt(req.body.maxAttendees) || 100
    },
    select: { id: true }
  })

  next()

})

export const removeGroup = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
  await prisma.$transaction([
    prisma.membership.deleteMany({
      where: { groupId: req.group.id }
    }),
    prisma.group.delete({
      where: { id: req.group.id },
    }),
  ])
  next()
})
