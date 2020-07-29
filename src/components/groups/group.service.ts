import { Request, Response, NextFunction} from 'express'

import { Group } from './group'
import { User } from '../users/user'
import { formatMdToSafeHTML } from '../../util/convertMarkdown'
import { asyncWrapper } from '../../util/asyncWrapper'

export const getGroups = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
  const page = parseInt(req.query.page ?? 0)
  const limit = 10
  const pageObject = await Group.query().orderBy('createdAt', 'DESC').page(page, limit)
  req.groups = pageObject.results.map(group => {
    const raw = group.description.slice(0, 50) + (group.description.length > 50 ? ' ...' : '')
    group.description = formatMdToSafeHTML(raw)
    return group
  })

  req.paginationOptions = {
    pageNum: Math.ceil(pageObject.total / limit),
    current: page
  }
  next()
})

export const getGroup = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
  const group = await Group.query()
    .findOne({ id: parseInt(req.params.id) })
    .withGraphFetched('users')

  if (group) {
    if (req.path.includes('/copy'))
      req.group = group
    else
      req.group = { ...group, description: formatMdToSafeHTML(group.description) } as Group
    next()
  } else {
    res.render('error/not-found')
  }
})

export const createGroup = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
  req.group = await Group.query()
    .insert(
      {
        name: req.body.name,
        tags: req.body.tags ?? '',
        room: parseInt(req.body.room),
        description: req.body.description,
        doNotDisturb: !!req.body.doNotDisturb,
        startDate: new Date(req.body.startDate),
        endDate: new Date(req.body.endDate),
        ownerId: (req.user as User).id
      }
    )

  next()
})

export const removeGroup = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
  await Group.transaction(async trx => {
    await Group.relatedQuery('users', trx)
      .for(req.group.id)
      .unrelate()

    await Group.query(trx).deleteById(req.group.id)
  })

  next()
})
