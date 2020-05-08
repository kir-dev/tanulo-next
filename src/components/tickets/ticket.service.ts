import { Ticket } from './ticket'
import { Request, Response, NextFunction } from 'express'
import { formatMdToSafeHTML } from '../../util/convertMarkdown'

export const getTickets = async (req: Request, _res: Response, next: NextFunction) => {
  req.tickets = (await Ticket.query().orderBy('createdAt', 'ASC')).map(ticket => {
    ticket.description = formatMdToSafeHTML(ticket.description)
    return ticket
  })
  next()
}

export const createTicket = async (req: Request, _res: Response, next: NextFunction) => {
  await Ticket.transaction(async trx => {
    return await Ticket.query(trx)
      .insert(
        {
          roomNumber: +req.body.roomNumber,
          description: req.body.description
        }
      )
  })
  next()
}

export const removeTicket = async (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id)
  if (!isNaN(id)) {
    const deletedCount = await Ticket.query()
      .findById(id)
      .delete()

    if (deletedCount === 0) {
      res.status(404).send({ message: 'Nem található hibajegy a megadott ID-val' })
    } else {
      next()
    }
  } else {
    res.status(404).send({ message: 'A megadott ID nem megfelelő formátumú' })
  }
}
