import { Request, Response, NextFunction } from 'express'

import { formatMdToSafeHTML } from '../../util/convertMarkdown'
import { asyncWrapper } from '../../util/asyncWrapper'
import { sendEmail } from '../../util/sendEmail'
import { prisma } from '../../prisma'
import { RoleType, StatusType } from '@prisma/client'

export const getOtherTickets = asyncWrapper(
  async (req: Request, _res: Response, next: NextFunction) => {
    req.otherTickets = (await prisma.ticket.findMany({
      where: { NOT: { ownerId: req.user.id } },
      orderBy: { createdAt: 'asc' }
    })).map(ticket => {
      ticket.description = formatMdToSafeHTML(ticket.description)
      return ticket
    })
    next()
  })

export const getMyTickets = asyncWrapper(
  async (req: Request, _res: Response, next: NextFunction) => {
    req.myTickets = (await prisma.ticket.findMany({
      where: { ownerId: req.user.id },
      orderBy: { createdAt: 'asc' }
    })).map(ticket => {
      ticket.description = formatMdToSafeHTML(ticket.description)
      return ticket
    })
    next()
  })

export const createTicket = asyncWrapper(
  async (req: Request, _res: Response, next: NextFunction) => {
    await prisma.ticket.create({
      data: {
        roomNumber: +req.body.roomNumber,
        description: req.body.description,
        ownerId: req.user.id,
      }
    })
    next()
  })

export const sendEmailToTicketAdmins = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const ticket = req.body

    const emailRecepients = await prisma.user.findMany({ where: { role: RoleType.TicketAdmin } })
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
    await prisma.ticket.update({
      where: { id },
      data: { status: req.body.status || StatusType.Sent }
    })
    next()
  })

export const removeTicket = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id)
    if (!isNaN(id)) {
      const deletedTicket = await prisma.ticket.delete({ where: { id }, select: { id: true } })

      if (!deletedTicket) {
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
    const ticket = await prisma.ticket.findFirst({ where: { id: parseInt(req.params.id) } })
    if (ticket.ownerId == req.user.id) {
      next()
    } else {
      return res.sendStatus(403)
    }
  })
