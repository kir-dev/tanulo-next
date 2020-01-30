import format from 'date-fns/format'
import { Request, Response } from 'express'

import { User } from '../entity/User'
import { getGroupsDesc, getGroup, createGroup, deleteGroup } from '../services/group.service'
import { getUser } from '../services/user.service'
import { DATE_FORMAT, ROOMS } from '../util/constants'

export const index = async (_req: Request, res: Response) => {
  const groups = await getGroupsDesc()
  res.render('group/index', {
    groups,
    format,
    DATE_FORMAT
  })
}

export const show = async (req: Request, res: Response) => {
  const group = await getGroup(+req.params.id)
  if (group) {
    const joined = group.users.some(u => u.id === (req.user as User).id)
    const isOwner = group.owner.id === (req.user as User).id
    res.render('group/show', {
      group, joined, isOwner, format, DATE_FORMAT
    })
  } else {
    res.redirect('/not-found')
  }
}

export const createForm = async (req: Request, res: Response) => {
  res.render('group/new', {
    start: req.query?.start?.split(' ')[0].slice(0, -3),
    end: req.query?.end?.split(' ')[0].slice(0, -3),
    roomId: req.query?.roomId,
    ROOMS
  })
}

export const create = async (req: Request, res: Response) => {
  await createGroup(req.body, req.user as User)
  res.redirect('/groups')
}

export const destroy = async (_req: Request, res: Response) => {
  const group = res.locals.group
  await deleteGroup(group)
  res.redirect('/groups')
}

export const join = async (req: Request, res: Response) => {
  const user = await getUser({ where: { id: (req.user as User).id } })
  const group = await getGroup(+req.params.id)

  if (!group) return res.redirect('/not-found')

  if (!group.doNotDisturb && !group.users.includes(user)) {
    group.users.push(user)
    await group.save()
  }
  res.redirect('/groups')
}

export const leave = async (req: Request, res: Response) => {
  const group = await getGroup(+req.params.id)

  if (!group) return res.redirect('/not-found')

  group.users = group.users.filter(user => user.id !== (req.user as User).id)
  await group.save()
  res.redirect(`/groups/${req.params.id}`)
}
