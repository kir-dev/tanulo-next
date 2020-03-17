import { Ticket } from './ticket.entity'
import { Request, Response, NextFunction } from 'express'

export const getTickets = async (req: Request, _res: Response, next: NextFunction) => {
  req.flash('success', 'Hello from the other side')
  req.tickets = await Ticket.find({ order: { createdAt: 'ASC' } })
  next()
}

export const createTicket = async (req: Request, _res: Response, next: NextFunction) => {
  const ticket = Ticket.create()
  ticket.roomNumber = req.body.roomNumber
  ticket.description = req.body.description
  await ticket.save()
  next()
}

export const removeTicket = async (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id)
  if (!isNaN(id)) {
    const result = await Ticket.delete({ id })
    if (result.affected === 0) {
      res.status(404).send({ message: 'Nem található hibajegy a megadott ID-val' })
    } else {
      next()
    }
  } else {
    res.status(404).send({ message: 'A megadott ID nem megfelelő formátumú' })
  }
}
