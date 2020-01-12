import { Request, Response } from 'express'
import format from 'date-fns/format'

import { Ticket } from '../entity/Ticket'
import { User } from '../entity/User'
import { DATE_FORMAT } from '../util/constants'

export const getTickets = async (req: Request, res: Response) => {
  const tickets = await Ticket.find({ order: { createdAt: 'ASC' } })
  res.render('ticket/index', {
    tickets,
    admin: (req.user as User).admin,
    format,
    DATE_FORMAT
  })
}

export const getTicketForm = async (_req: Request, res: Response) => {
  res.render('ticket/new')
}

export const createTicket = async (req: Request, res: Response) => {
  const ticket = Ticket.create()
  ticket.roomNumber = req.body.roomNumber
  ticket.description = req.body.description
  await ticket.save()
  res.redirect('/tickets')
}

export const deleteTicket = async (req: Request, res: Response) => {
  const ticket = await Ticket.findOne({ id: +req.params.id })
  if (ticket) {
    Ticket.remove(ticket)
  }
  res.redirect('/tickets')
}
