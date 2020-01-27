import { Request, Response } from 'express'
import format from 'date-fns/format'

import { Ticket } from '../entity/Ticket'
import { User } from '../entity/User'
import { getTicketsAsc, getTicket } from '../services/ticket.service'
import { DATE_FORMAT } from '../util/constants'

export const index = async (req: Request, res: Response) => {
  const tickets = await getTicketsAsc()
  res.render('ticket/index', {
    tickets,
    admin: (req.user as User).admin,
    format,
    DATE_FORMAT
  })
}

export const createForm = async (_req: Request, res: Response) => {
  res.render('ticket/new')
}

export const create = async (req: Request, res: Response) => {
  const ticket = Ticket.create()
  ticket.roomNumber = req.body.roomNumber
  ticket.description = req.body.description
  await ticket.save()
  res.redirect('/tickets')
}

export const destroy = async (req: Request, res: Response) => {
  const ticket = await getTicket(+req.params.id)
  if (ticket) {
    Ticket.remove(ticket)
    res.redirect('/tickets')
  } else {
    res.redirect('/not-found')
  }
}
