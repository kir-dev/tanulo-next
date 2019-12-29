import { Request, Response } from 'express'

import { Ticket } from '../entity/Ticket'
import { User } from '../entity/User'

export const getTickets = async(req: Request, res: Response) => {
  const tickets = await Ticket.find({ order: { createdAt: 'ASC' } })
  res.render('ticket/index', { tickets, admin: (req.user as User).admin })
}

export const getTicketForm = async(req: Request, res: Response) => {
  res.render('ticket/new')
}

export const createTicket = async(req: Request, res: Response) => {
  const ticket = Ticket.create()
  ticket.roomNumber = req.body.roomNumber
  ticket.description = req.body.description
  await ticket.save()
  res.redirect('/tickets')
}

export const deleteTicket = async(req: Request, res: Response) => {
  Ticket.delete({ id: +req.params.id })
  res.redirect('/tickets')
}