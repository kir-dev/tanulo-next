import * as Knex from 'knex'
import faker from 'faker'

export async function seed(knex: Knex): Promise<void> {

  const startingFloor = 3
  const floorCount = 16
  const groupsPerFloor = 4
  const groupArray = []
  const connectArray = []
  let connectCountSum = 0
  for (let i = 0; i < floorCount; ++i) {
    for (let j = 0; j < groupsPerFloor; ++j) {
      // Compose description
      let description = faker.datatype.boolean()?
        ('## ' + faker.random.words(5)) : faker.random.words(6)

      description += '\n'

      for (let k = 0; k < faker.datatype.number(3) + 2; ++k) {
        description += '* ' + faker.lorem.words(3) + '\n'
      }


      // Compose group
      const startSeed = faker.datatype.number(500) * 1_000_000 * (faker.datatype.boolean() ? -1 : 1)
      const maxTwoHours = faker.datatype.number(6600) * 1000 + 600_000
      const ownerId = (i * groupsPerFloor + j) % 16 + 1
      const groupId = (i * groupsPerFloor + j) + 1

      const group = {
        name: faker.company.catchPhrase(),
        tags: faker.random.words(faker.datatype.number(5)).split(' ').join(','),
        description,
        startDate: (new Date(Date.now() + startSeed * (j + 1))),
        endDate: (new Date(Date.now() + startSeed * (j + 1) + maxTwoHours)),
        room: i + startingFloor,
        doNotDisturb: (i * groupsPerFloor + j) % 16 == 1,
        maxAttendees: 100,
        createdAt: new Date(),
        ownerId,
        kind: (i + j) % 3 === 0 ? 'CLASSIC' : 'PRIVATE'
      }
      console.log('\x1b[33m%s\x1b[0m',
        `Group: #${groupId} ${group.name}, floor: ${group.room}, owner: ${ownerId}`)
      groupArray.push(group)

      // Connect groups and users
      const connectOwner = {
        userId: (i * groupsPerFloor + j) % 16 + 1,
        groupId: (i * groupsPerFloor + j) + 1,
        groupRole: 'OWNER'
      }
      console.log(`Connect: owner #${connectOwner.userId} to #${connectOwner.groupId}`)
      connectArray.push(connectOwner)
      connectCountSum++

      for (let k = 1; k < ownerId; ++k) {
        const isUnapproved = group.kind === 'PRIVATE' && (k % 2 === 0 || k % 3 === 0)
        const connect = {
          userId: k,
          groupId,
          groupRole: isUnapproved ? 'UNAPPROVED' : 'MEMBER'
        }
        console.log(`Connect: user #${connect.userId} to #${connect.groupId}`)
        connectArray.push(connect)
        connectCountSum++
      }
    }
  }

  // Inserts seed entries
  await knex('groups').insert(groupArray)
  await knex('users_groups').insert(connectArray)
  console.log('\x1b[32m%s\x1b[0m', `Inserted ${groupsPerFloor * floorCount} groups into db.`)
  console.log('\x1b[32m%s\x1b[0m', `Inserted ${connectCountSum} users_groups into db.`)
}
