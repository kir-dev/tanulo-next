import { Request, Response, NextFunction} from 'express'
import { Group } from './group'
import { User } from '../users/user'
import markdown from 'markdown-it'
import sanitizeHtml from 'sanitize-html'

function formatMdToSafeHTML(mdBody: string): string {
  const dirtyHtml = new markdown().render(mdBody)
  const cleanHtml = sanitizeHtml(dirtyHtml, {
    transformTags: {
      'h1': 'h3',
      'h2': 'h4',
      'h3': 'h5',
      'h4': 'h5'
    }
  })
  return cleanHtml
}
export const getGroups = async (req: Request, res: Response, next: NextFunction) => {
  const page = parseInt(req.query.page ?? 0)
  const limit = 10
  const pageObject = await Group.query().orderBy('createdAt', 'DESC').page(page, limit)
  req.groups = pageObject.results

  req.groups.forEach((group) => {
    group.description = group.description.slice(0, 50) + ' ...'
    group.description = formatMdToSafeHTML(group.description)
  })

  req.paginationOptions = {
    pageNum: Math.ceil(pageObject.total / limit),
    current: page
  }
  next()
}

export const getGroup = async (req: Request, res: Response, next: NextFunction) => {
  const group = await Group.query()
    .findOne({ id: parseInt(req.params.id) })
    .withGraphFetched('users')

  if (group) {
    group.description = formatMdToSafeHTML(group.description)
    req.group = group
    next()
  } else {
    res.render('error/not-found')
  }
}

export const createGroup = async (req: Request, res: Response, next: NextFunction) => {
  req.group = await Group.query()
    .insert(
      {
        name: req.body.name,
        subject: req.body.subject,
        room: parseInt(req.body.room),
        description: req.body.description,
        doNotDisturb: !!req.body.doNotDisturb,
        startDate: new Date(req.body.startDate),
        endDate: new Date(req.body.endDate),
        ownerId: (req.user as User).id
      }
    )

  next()
}

export const removeGroup = async (req: Request, res: Response, next: NextFunction) => {
  await Group.relatedQuery('users')
    .for(req.group.id)
    .unrelate()

  await Group.query().deleteById(req.group.id)

  next()
}
