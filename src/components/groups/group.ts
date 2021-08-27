import { Model } from 'objection'

import { User } from '../users/user'
import { GroupMember } from './groupMember'
import { GroupRole } from './grouprole'

export enum GroupType {
  classic = 'CLASSIC',
  private = 'PRIVATE'
}

export class Group extends Model {
  id!: number
  name: string
  tags: string
  description: string
  startDate: Date
  endDate: Date
  room?: number
  link?: string
  place?: string
  doNotDisturb: boolean
  ownerId: number
  users: GroupMember[]
  createdAt: Date
  maxAttendees: number
  type = GroupType.classic

  isApproved(userId: User['id']): boolean {
    return this.users.some(
      x => x.id === userId && x.groupRole !== GroupRole.unapproved)
  }


  canSeeMembers(userId: User['id']): boolean {
    return this.type !== GroupType.private || this.isApproved(userId)
  }

  $beforeInsert(): void {
    this.createdAt = new Date()
  }

  static get tableName(): string {
    return 'groups'
  }

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  static get relationMappings(): Record<string, any> {
    return {
      users: {
        relation: Model.ManyToManyRelation,
        modelClass: User,

        join: {
          from: 'groups.id',
          // ManyToMany relation needs the `through` object to describe the join table.
          through: {
            from: 'users_groups.groupId',
            to: 'users_groups.userId',
            extra: ['group_role']
          },
          to: 'users.id'
        }
      }
    }
  }

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  static get jsonSchema(): Record<string, any> {
    return {
      type: 'object',
      required: ['name', 'description', 'doNotDisturb', 'tags', 'startDate', 'endDate'],

      properties: {
        id: { type: 'integer' },
        name: { type: 'string', minLength: 1, maxLength: 255 },
        description: { type: 'string' },
        doNotDisturb: { type: 'boolean' },
        tags: { type: 'string' },
        room: { type: ['number', 'null'] },
        link: { type: 'string' },
        place: { type: 'string' },
        startDate: { type: 'datetime' },
        endDate: { type: 'datetime' },
        maxAttendees: { type: 'integer' },
        type: { type: 'string' }
      }
    }
  }
}
