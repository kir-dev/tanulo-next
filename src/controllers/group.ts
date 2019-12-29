import { Group } from '../entity/Group'
import { Request, Response } from 'express'
import { User } from '../entity/User'

import { ROOMS } from '../util/constants'

export const getGroups = async (req: Request, res: Response) => {
  const groups = await Group.find()
  res.render('group/index', { groups })
}

export const getGroup = async(req: Request, res: Response) => {
  const group = (await Group.find(
    {
      relations: ['users'],
      where: { id: req.params.id }
    }))[0]
  const joined = group.users.some(u => u.id === (req.user as User).id)
  res.render('group/show', { group, joined })
}

export const getGroupForm = async (req: Request, res: Response) => {
  res.render('group/new', {
    start: req.query?.start?.split(' ')[0].slice(0, -3),
    end: req.query?.end?.split(' ')[0].slice(0, -3),
    roomId: req.query?.roomId,
    ROOMS
  })
}

export const createGroup = async(req: Request, res: Response) => {
  const newGroup = Group.create()
  newGroup.name = req.body.name
  newGroup.room = req.body.room
  newGroup.owner = req.user as User
  newGroup.users = [req.user as User]
  newGroup.description = req.body.description
  newGroup.subject = req.body.subject
  newGroup.doNotDisturb = !!req.body.doNotDisturb
  newGroup.startDate = req.body.startDate
  newGroup.endDate = req.body.endDate
  await newGroup.save()
  res.redirect('/groups')
}

export const joinGroup = async(req: Request, res: Response) => {
  const user = await User.findOne({ id: (req.user as User).id })
  const group = (await Group.find(
    {
      relations: ['users'],
      where: {
        id: req.params.id
      }
    }))[0]
  if (!group.doNotDisturb && !group.users.includes(user)) {
    group.users.push(user)
    await group.save()
  }
  res.redirect('/groups')
}

export const leaveGroup = async(req: Request, res: Response) => {
  const group = (await Group.find(
    {
      relations: ['users'],
      where: {
        id: req.params.id
      }
    }))[0]
  group.users = group.users.filter(user => user.id !== (req.user as User).id)
  await group.save()
  res.redirect(`/groups/${req.params.id}`)
}
