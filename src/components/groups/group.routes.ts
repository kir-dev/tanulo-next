import {
  format,
  formatDistanceToNowStrict,
  formatDistanceStrict
} from 'date-fns'
import huLocale from 'date-fns/locale/hu'
import { Request, Response, Router } from 'express'
import multer from 'multer'

import { isAuthenticated } from '../../config/passport'
import { DATE_FORMAT, ROOMS } from '../../util/constants'
import { handleValidationError, checkIdParam } from '../../util/validators'
import { RoleType, User } from '../users/user'
import {
  joinGroup,
  sendEmailToOwner,
  leaveGroup,
  isMemberInGroup,
  approveMember,
  kickMember,
  sendEmailToMember,
  createICSEvent,
  checkConflicts,
  validateGroup,
  isGroupOwnerOrAdmin,
  checkValidMaxAttendeeLimit
} from './group.middlewares'
import { createGroup, getGroup, getGroups, updateGroup, removeGroup } from './group.service'
import { GroupRole } from './grouprole'
import { GroupKind } from './group'

const router = Router()

router.get('/', isAuthenticated, getGroups, (req, res) => {
  res.render('group/index', {
    groups: req.groups,
    paginationOpt: req.paginationOptions,
    dateFns: {
      format,
      formatDistanceStrict,
      formatDistanceToNowStrict,
      huLocale,
      DATE_FORMAT
    }
  })
})

router.get('/new', isAuthenticated, (req, res) =>
  res.render('group/new', {
    start: (req.query?.start as string)?.split(' ')[0].slice(0, -3),
    end: (req.query?.end as string)?.split(' ')[0].slice(0, -3),
    roomId: req.query?.roomId,
    ROOMS
  })
)

router.post('/',
  isAuthenticated,
  multer().none(),
  validateGroup(),
  handleValidationError(400),
  checkConflicts,
  createGroup,
  joinGroup,
  (req: Request, res: Response) => res.sendStatus(201)
)

router.get('/:id',
  isAuthenticated,
  checkIdParam,
  getGroup,
  (req, res) => {
    const { group } = req
    const user = req.user as User
    const userId = user.id

    const joined = group.users.some(u => u.id === userId)
    const isOwner = group.ownerId === userId
    const isAdmin = user.role == RoleType.ADMIN
    const canSeeMembers = isOwner || isAdmin || group.canSeeMembers(userId)
    const canModerate = isOwner || isAdmin
    res.render('group/show', {
      group,
      joined,
      isOwner,
      format,
      DATE_FORMAT,
      isAdmin,
      canSeeMembers,
      canModerate,
      GroupKind,
      GroupRole,
      userId,
      userRole: group.users.find(x => x.id === userId)?.groupRole
    })
  })

router.post('/:id/join',
  isAuthenticated,
  getGroup,
  joinGroup,
  sendEmailToOwner,
  (req, res) => res.redirect(`/groups/${req.params.id}`)
)

router.post('/:id/leave',
  isAuthenticated,
  getGroup,
  leaveGroup,
  (req, res) => res.redirect('/groups')
)

router.post('/:id/approve/:userid',
  isAuthenticated,
  getGroup,
  isGroupOwnerOrAdmin,
  isMemberInGroup,
  approveMember,
  sendEmailToMember,
  (req, res) => res.redirect(`/groups/${req.params.id}`)
)

router.post('/:id/kick/:userid',
  isAuthenticated,
  getGroup,
  isGroupOwnerOrAdmin,
  isMemberInGroup,
  kickMember,
  sendEmailToMember,
  (req, res) => res.redirect(`/groups/${req.params.id}`)
)

router.delete('/:id',
  isAuthenticated,
  getGroup,
  isGroupOwnerOrAdmin,
  removeGroup,
  (req, res) => res.status(204).send('Csoport sikeresen törölve')
)

router.get('/:id/copy',
  isAuthenticated,
  checkIdParam,
  getGroup,
  (req, res) =>
    res.render('group/new', {
      roomId: req.group.room,
      link: req.group.link,
      place: req.group.place,
      name: req.group.name,
      description: req.group.description,
      tags: req.group.tags,
      kind: req.group.kind,
      ROOMS
    })
)

router.get('/:id/edit',
  isAuthenticated,
  checkIdParam,
  getGroup,
  isGroupOwnerOrAdmin,
  (req, res) =>
    res.render('group/new', {
      roomId: req.group.room,
      link: req.group.link,
      place: req.group.place,
      name: req.group.name,
      start: req.group.startDate,
      end: req.group.endDate,
      description: req.group.description,
      tags: req.group.tags,
      doNotDisturb: req.group.doNotDisturb,
      ROOMS,
      isEditing: true,
      groupId: req.group.id,
      maxAttendees: req.group.maxAttendees,
      kind: req.group.kind,
    })
)

router.put('/:id',
  isAuthenticated,
  checkIdParam,
  getGroup,
  isGroupOwnerOrAdmin,
  multer().none(),
  validateGroup(),
  handleValidationError(400),
  checkConflicts,
  checkValidMaxAttendeeLimit,
  updateGroup,
  (req: Request, res: Response) => res.sendStatus(201)
)

router.get('/:id/export', isAuthenticated, checkIdParam, getGroup, createICSEvent)

export default router
