import { Ticket } from '../entity/Ticket'

export const getTicketsAsc = async () => {
  return await Ticket.find({ order: { createdAt: 'ASC' } })
}

export const getTicket = async (id: number) => {
  return await Ticket.findOne({ id })
}
