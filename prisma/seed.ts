import { PrismaClient, RoleType, User, Group, Membership, StatusType } from '@prisma/client'
import faker from 'faker'

const prisma = new PrismaClient()

async function addUsers() {
  await prisma.user.deleteMany()

  const userCount = 16
  const userArray = []
  for (let i = 0; i < userCount; ++i) {
    const user: Omit<User, 'id'> = {
      name: faker.name.findName(),
      email: faker.internet.email(),
      authSchId: faker.datatype.uuid(),
      role: RoleType.User,
      wantEmail: faker.datatype.boolean(),
      floor: faker.datatype.boolean() ? faker.datatype.number(18 - 3) + 3 : null
    }
    console.log('\x1b[33m%s\x1b[0m', `User: #${i + 1} ${user.name}`)
    userArray.push(user)
  }

  await prisma.user.createMany({ data: userArray })
}

async function addGroups() {
  const startingFloor = 3
  const floorCount = 16
  const groupsPerFloor = 4
  const groupArray = []
  const connectArray = []
  let connectCountSum = 0
  for (let i = 0; i < floorCount; ++i) {
    for (let j = 0; j < groupsPerFloor; ++j) {
      // Compose description
      let description = faker.datatype.boolean() ?
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

      const group: Omit<Group, 'id' | 'link' | 'place'> = {
        name: faker.company.catchPhrase(),
        tags: faker.random.words(faker.datatype.number(5)).split(' ').join(','),
        description,
        startDate: (new Date(Date.now() + startSeed * (j + 1))),
        endDate: (new Date(Date.now() + startSeed * (j + 1) + maxTwoHours)),
        room: i + startingFloor,
        doNotDisturb: (i * groupsPerFloor + j) % 16 == 1,
        maxAttendees: 100,
        createdAt: new Date(),
        ownerId
      }
      console.log('\x1b[33m%s\x1b[0m',
        `Group: #${groupId} ${group.name}, floor: ${group.room}, owner: ${group.ownerId}`)
      groupArray.push(group)

      // Connect groups and users
      const connectOwner: Omit<Membership, 'id'> = {
        userId: (i * groupsPerFloor + j) % 16 + 1,
        groupId: (i * groupsPerFloor + j) + 1,
      }
      console.log(`Connect: owner #${connectOwner.userId} to #${connectOwner.groupId}`)
      connectArray.push(connectOwner)
      connectCountSum++

      for (let k = 1; k < ownerId; ++k) {
        const connect = {
          userId: k,
          groupId
        }
        console.log(`Connect: user #${connect.userId} to #${connect.groupId}`)
        connectArray.push(connect)
        connectCountSum++
      }
    }
  }

  // Inserts seed entries
  await prisma.group.createMany({ data: groupArray })
  await prisma.membership.createMany({ data: connectArray })
  console.log('\x1b[32m%s\x1b[0m', `Inserted ${groupsPerFloor * floorCount} groups into db.`)
  console.log('\x1b[32m%s\x1b[0m', `Inserted ${connectCountSum} users_groups into db.`)
}

async function addTickets() {
  const statuses = Object.keys(StatusType)
  const ticketCount = 12
  const ticketArray = []
  for (let i = 0; i < ticketCount; ++i) {
    const ticket = {
      description: faker.lorem.sentences(5),
      roomNumber: faker.datatype.number(15) + 3,
      createdAt: (new Date( Date.now() - faker.datatype.number(500) * 1_000_000 )),
      status: statuses[faker.datatype.number(3)]
    }
    console.log('\x1b[33m%s\x1b[0m', `Ticket: #${i+1}`)
    ticketArray.push(ticket)
  }

  // Inserts seed entries
  await prisma.ticket.createMany({ data: ticketArray })
  console.log('\x1b[32m%s\x1b[0m', `Inserted ${ticketCount} tickets into db.`)
}

async function main() {
  await prisma.membership.deleteMany()
  await prisma.user.deleteMany()
  await prisma.group.deleteMany()

  await prisma.$executeRaw('TRUNCATE tickets, users_groups, groups, users RESTART IDENTITY CASCADE')


  await addUsers()
  await addGroups()
  await addTickets()
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
