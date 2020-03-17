import format from 'date-fns/format'
import { Router } from 'express'

import { isAdmin, isAuthenticated } from '../config/passport'
import { User } from '../entity/user.entity'
import { DATE_FORMAT } from '../util/constants'
import { createTicket, getTickets, removeTicket } from './ticket.service'

const router = Router()

router.get('/', isAuthenticated, getTickets, (req, res) =>
  res.render('ticket/index', {
    tickets: req.tickets,
    admin: (req.user as User).admin,
    format,
    DATE_FORMAT
  }))

router.get('/new', isAuthenticated, (req, res) => {
  req.flash('success', 'aaaaaaaaaaa')
  res.render('ticket/new', { flash: req.flash('success') })
})

router.post('/', isAuthenticated, createTicket, (_req, res) => res.redirect('/tickets'))

router.delete('/:id', isAdmin, removeTicket, (_req, res) =>
  res.status(204).send('A hibajegy sikeresen törölve')
)

export default router
