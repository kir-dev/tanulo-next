import format from 'date-fns/format'
import { Request, Response, Router } from 'express'
import { check } from 'express-validator'
import multer from 'multer'

import { isAdmin, isAuthenticated } from '../../config/passport'
import { DATE_FORMAT, ROOMS } from '../../util/constants'
import { User } from '../users/user'
import { createTicket, getTickets, removeTicket } from './ticket.service'
import { handeValidationError } from '../../util/errorHandlers'

const router = Router()

router.get('/', isAuthenticated, getTickets, (req, res) =>
  res.render('ticket/index', {
    tickets: req.tickets,
    admin: (req.user as User)?.admin,
    format,
    DATE_FORMAT
  }))

router.get('/new', isAuthenticated, (_req, res) => res.render('ticket/new', { ROOMS }))

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
  handeValidationError(400),
  createTicket,
  (_req: Request, res: Response) => res.sendStatus(201)
)

router.delete('/:id', isAuthenticated, isAdmin, removeTicket, (_req, res) =>
  res.status(204).send('A hibajegy sikeresen törölve')
)

export default router
