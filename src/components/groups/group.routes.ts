import {
  format,
  formatDistanceToNowStrict,
  formatDistanceStrict
} from 'date-fns'
import huLocale from 'date-fns/locale/hu'
import { Request, Response, Router } from 'express'
import { check } from 'express-validator'
import multer from 'multer'

import { isAuthenticated } from '../../config/passport'
import { DATE_FORMAT, ROOMS } from '../../util/constants'
import { handleValidationError } from '../../util/errorHandlers'
import { User } from '../users/user'
import { isGroupOwner, joinGroup, leaveGroup, createICSEvent } from './group.middlewares'
import { createGroup, getGroup, getGroups, removeGroup } from './group.service'

function validateGroup() {
  return [
    check('name', 'A csoport neve max 100 karakter hosszú nem üres szöveg lehet')
      .isString()
      .exists({ checkNull: true, checkFalsy: true })
      .notEmpty()
      .trim()
      .isLength({ max: 100 }),
    check('tags')
      .optional({ nullable: true, checkFalsy: true })
      .isString()
      .custom((value: string) => value.split(',').length <= 8)
      .withMessage('Max 8 címke adható hozzá')
      .custom((value: string) => value.split(',').every(it => it.length <= 30))
      .withMessage('A címkék egyenként max 30 karakter hosszúak lehetnek'),
    check('room')
      .exists({ checkNull: true })
      .withMessage('A szint nem lehet üres')
      .isInt({ gt: 2, lt: 19 })
      .withMessage('A szint csak 3 és 18 közötti értéket vehet fel'),
    check('startDate')
      .exists({ checkNull: true, checkFalsy: true })
      .isAfter()
      .withMessage('Múltbéli kezdéssel csoport nem hozható létre')
      .custom((value, { req }) => new Date(value).getTime() < new Date(req.body.endDate).getTime())
      .withMessage('A kezdés nem lehet korábban, mint a befejezés'),
    check('endDate', 'A befejezés időpontja kötelező')
      .exists({ checkFalsy: true, checkNull: true }),
    check('description', 'A leírás max 500 karakter lehet')
      .optional({ nullable: true })
      .isString()
      .isLength({ max: 500 })
  ]
}

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
    start: req.query?.start?.split(' ')[0].slice(0, -3),
    end: req.query?.end?.split(' ')[0].slice(0, -3),
    roomId: req.query?.roomId,
    ROOMS
  })
)

router.post('/',
  isAuthenticated,
  multer().none(),
  validateGroup(),
  handleValidationError(400),
  createGroup,
  joinGroup,
  (req: Request, res: Response) => res.sendStatus(201)
)

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
  (req, res) => res.redirect(`/groups/${req.params.id}`)
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

router.get('/:id/copy', isAuthenticated, getGroup, (req, res) =>
  res.render('group/new', {
    roomId: req.group.room,
    name: req.group.name,
    description: req.group.description,
    tags: req.group.tags,
    ROOMS
  })
)

router.get('/:id/export', isAuthenticated, getGroup, createICSEvent)

export default router
