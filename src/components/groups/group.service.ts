import { Request, Response, NextFunction } from 'express'

import { Group } from './group'
import { formatMdToSafeHTML } from '../../util/convertMarkdown'
import { asyncWrapper } from '../../util/asyncWrapper'

export const getGroups = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
  const page = isNaN(Number(req.query.page)) ? 0 : Number(req.query.page)
  const limit = 20
  const pageObject = req.query.past === 'true' ?
    await Group.query().where('endDate', '<', new Date())
      .orderBy('startDate', 'DESC').page(page, limit) :
    await Group.query().where('endDate', '>=', new Date())
      .orderBy('startDate', 'ASC').page(page, limit)
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
    // Getting raw description for /copy and /edit pages
    if (/\/copy|\/edit/.test(req.path))
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
    )

  next()
})

export const updateGroup = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {

  await Group.query()
    .patch({
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
    })
    .findById(req.params.id)
    .catch((err) => {
      console.log(err)
      return next(err)
    })

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
