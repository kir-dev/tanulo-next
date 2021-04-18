import format from 'date-fns/format'
import { Request, Response, Router } from 'express'
import { check } from 'express-validator'
import multer from 'multer'

import { isAuthenticated, requireRoles } from '../../config/passport'
import { DATE_FORMAT, ROOMS, STATUSES } from '../../util/constants'
import { createTicket, getAllTickets, getMyTickets,
  moveTicket, removeTicket } from './ticket.service'

import { handleValidationError } from '../../util/validators'
import { RoleType } from '../users/user'

const router = Router()

router.get('/',
  isAuthenticated,
  getAllTickets,
  getMyTickets, (req, res) =>
    res.render('ticket/index', {
      allTickets: req.allTickets,
      myTickets: req.myTickets,
      format,
      DATE_FORMAT,
      STATUSES
    }))

router.get('/new', isAuthenticated, (_req, res) => res.render('ticket/new', { ROOMS }))

router.put('/:id',
  isAuthenticated,
  requireRoles(RoleType.ADMIN, RoleType.TICKET_ADMIN),
  multer().none(),
  [
    check('status')
      .notEmpty()
      .withMessage('A státusz nem lehet üres')
      .isString()
  ],
  handleValidationError(400),
  moveTicket, (req, res) =>
    res.json(STATUSES.get(req.body.status))
)

router.post('/',
  isAuthenticated,
  multer().none(),
  [
    check('roomNumber')
      .notEmpty()              .withMessage('A szint nem lehet üres')
      .isInt({ gt: 2, lt: 19 }).withMessage('A szint csak 3 és 18 közötti értéket vehet fel'),
    check('description')
      .notEmpty()              .withMessage('A leírás nem lehet üres')
      .isLength({ max: 500 })  .withMessage('A leírás max 500 karakter lehet')
  ],
  handleValidationError(400),
  createTicket,
  (_req: Request, res: Response) => res.sendStatus(201)
)

router.delete('/:id',
  isAuthenticated,
  requireRoles(RoleType.ADMIN, RoleType.TICKET_ADMIN),
  removeTicket, (_req, res) => res.status(204).send('A hibajegy sikeresen törölve')
)

export default router
