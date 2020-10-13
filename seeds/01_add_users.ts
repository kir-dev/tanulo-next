import * as Knex from 'knex'
import faker from 'faker'

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries not considering FK constraints
  await knex.raw('TRUNCATE tickets, users_groups, groups, users RESTART IDENTITY CASCADE')

  const userCount = 16
  const userArray = []
  for (let i = 0; i < userCount; ++i) {
    const user = {
      name: faker.name.findName(),
      email: faker.internet.email(), 
      authSchId: faker.random.uuid(),
      admin: false 
    }
    console.log('\x1b[33m%s\x1b[0m', `User: #${i+1} ${user.name}`)
    userArray.push(user)
  }

  // Inserts seed entries
  await knex('users').insert(userArray)
  console.log('\x1b[32m%s\x1b[0m', `Inserted ${userCount} users into db.`)
}
