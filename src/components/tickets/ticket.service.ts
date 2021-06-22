import { StatusType, Ticket } from './ticket'
import { Request, Response, NextFunction } from 'express'

import { formatMdToSafeHTML } from '../../util/convertMarkdown'
import { asyncWrapper } from '../../util/asyncWrapper'
import { sendEmail } from '../../util/sendEmail'

import { User } from '../users/user'

export const getOtherTickets = asyncWrapper(
  async (req: Request, _res: Response, next: NextFunction) => {
    req.otherTickets = (await Ticket.query().where('userId', '!=', (req.user as User).id)
      .orderBy('createdAt', 'ASC')).map(ticket => {
      ticket.description = formatMdToSafeHTML(ticket.description)
      return ticket
    })
    next()
  })

export const getMyTickets = asyncWrapper(
  async (req: Request, _res: Response, next: NextFunction) => {
    req.myTickets = (await Ticket.query().where('userId', '=', (req.user as User).id)
      .orderBy('createdAt', 'ASC')).map(ticket => {
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
            description: req.body.description,
            userId: (req.user as User).id,
          }
        )
    })
    next()
  })

export const sendEmailToTicketAdmins = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) =>  {
    const ticket = req.body

    const emailRecepients = await User.query().where('role', '=', 'TICKET_ADMIN')
    sendEmail(emailRecepients, {
      subject: `Új hibajegyet vettek fel a ${ticket.roomNumber}. emeleti tanulószobába!`,
      body: `Új hibajegyet vettek fel a ${ticket.roomNumber}. emeleti tanulószobába!
       A hibajegy tartalma: "${ticket.description}"`,
      link: '/tickets',
      linkTitle: 'Hibajegy megtekintése'
    })
    next()
  })

export const moveTicket = asyncWrapper(
  async (req: Request, _res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id)
    await Ticket.query().findById(id).patch({ status: req.body.status || StatusType.SENT })
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

export const checkTicketOwner = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const ticket = await Ticket.query().findOne({ id: parseInt(req.params.id) })
    if (ticket.userId == (req.user as User).id) {
      next()
    } else {
      return res.sendStatus(403)
    }
  })
