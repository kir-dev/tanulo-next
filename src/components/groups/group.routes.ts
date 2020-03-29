import format from 'date-fns/format'
import { Router } from 'express'

import { isAuthenticated } from '../../config/passport'
import { DATE_FORMAT, ROOMS } from '../../util/constants'
import { User } from '../users/user'
import { isGroupOwner, joinGroup, leaveGroup } from './group.middlewares'
import { createGroup, getGroup, getGroups, removeGroup } from './group.service'

const router = Router()

router.get('/', isAuthenticated, getGroups, (req, res) =>
  res.render('group/index', {
    groups: req.groups,
    format,
    DATE_FORMAT
  }))

router.get('/new', isAuthenticated, (req, res) =>
  res.render('group/new', {
    start: req.query?.start?.split(' ')[0].slice(0, -3),
    end: req.query?.end?.split(' ')[0].slice(0, -3),
    roomId: req.query?.roomId,
    ROOMS
  })
)

router.post('/', isAuthenticated, createGroup, joinGroup, (req, res) => res.redirect('/groups'))

router.get('/:id', isAuthenticated, getGroup, (req, res) => {
  const joined = req.group.users.some(u => u.id === (req.user as User).id)
  const isOwner = req.group.ownerId === (req.user as User).id
  res.render('group/show', {
    group: req.group, joined, isOwner, format, DATE_FORMAT
  })
})

router.post('/:id/join',
  isAuthenticated,
  getGroup,
  joinGroup,
  (req, res) => res.redirect('/groups')
)

router.post('/:id/leave',
  isAuthenticated,
  getGroup,
  leaveGroup,
  (req, res) => res.redirect('/groups')
)

router.delete('/:id',
  isAuthenticated,
  getGroup,
  isGroupOwner,
  removeGroup,
  (req, res) => res.status(204).send('Csoport sikeresen törölve')
)

export default router
