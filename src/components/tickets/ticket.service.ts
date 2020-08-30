import { NextFunction, Request, Response } from 'express'

import agenda from '../../util/agenda'
import { formatMdToSafeHTML } from '../../util/convertMarkdown'
import { asyncWrapper } from '../../util/asyncWrapper'
import { Ticket } from './ticket'

export const getTickets = asyncWrapper(async (req: Request, _res: Response, next: NextFunction) => {
  req.tickets = (await Ticket.query().orderBy('createdAt', 'ASC')).map(ticket => {
    ticket.description = formatMdToSafeHTML(ticket.description)
    return ticket
  })
  next()
})

export const createTicket = asyncWrapper(
  async (req: Request, _res: Response, next: NextFunction) => {
    await Ticket.transaction(async trx => {
      return await Ticket.query(trx)
        .insert(
          {
            roomNumber: +req.body.roomNumber,
            description: req.body.description
          }
        )
    })
    await agenda.now('new-ticket-notify')
    next()
  })

export const removeTicket = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id)
    if (!isNaN(id)) {
      const deletedCount = await Ticket.query().deleteById(id)

      if (deletedCount === 0) {
        res.status(404).send({ message: 'Nem található hibajegy a megadott ID-val' })
      } else {
        next()
      }
    } else {
      res.status(404).send({ message: 'A megadott ID nem megfelelő formátumú' })
    }
  })
