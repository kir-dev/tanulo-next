import { Group } from '../entity/Group'
import { User } from '../entity/User'

export const getGroupsDesc = async () => await Group.find({ order: { createdAt: 'DESC' } })

export const getGroup = async (id: number) =>
  await Group.findOne(
    {
      relations: ['users', 'owner'],
      where: { id }
    }
  )

export const createGroup = async (group: Group, user: User) => {
  const newGroup = Group.create()
  newGroup.name = group.name
  newGroup.room = group.room
  newGroup.owner = user
  newGroup.users = [user]
  newGroup.description = group.description
  newGroup.subject = group.subject
  newGroup.doNotDisturb = !!group.doNotDisturb
  newGroup.startDate = group.startDate
  newGroup.endDate = group.endDate
  await newGroup.save()
}

export const deleteGroup = async (group: Group) => await Group.remove(group)
