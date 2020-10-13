import * as Knex from 'knex'
import faker from 'faker'

export async function seed(knex: Knex): Promise<void> {
  
  const statuses = ['SENT', 'IN_PROGRESS', 'DONE', 'ARCHIVED']
  const ticketCount = 12
  const ticketArray = []
  for (let i = 0; i < ticketCount; ++i) {
    const ticket = {
      description: faker.lorem.sentences(5),
      roomNumber: faker.random.number(15) + 3,
      createdAt: (new Date( Date.now() - faker.random.number(500) * 1_000_000 )),
      status: statuses[faker.random.number(3)]
    }
    console.log('\x1b[33m%s\x1b[0m', `Ticket: #${i+1}`)
    ticketArray.push(ticket)
  }

  // Inserts seed entries
  await knex('tickets').insert(ticketArray)
  console.log('\x1b[32m%s\x1b[0m', `Inserted ${ticketCount} tickets into db.`)
}
