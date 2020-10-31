import { Model } from 'objection'

import { User } from '../users/user'

export class Group extends Model {
  id!: number
  name: string
  tags: string
  description: string
  startDate: Date
  endDate: Date
  room: number
  doNotDisturb: boolean
  ownerId: number
  users: User[]
  createdAt: Date
  maxAttendees: number

  $beforeInsert() {
    this.createdAt = new Date()
  }

  static get tableName() {
    return 'groups'
  }

  static get relationMappings() {
    return {
      users: {
        relation: Model.ManyToManyRelation,
        modelClass: User,

        join: {
          from: 'groups.id',
          // ManyToMany relation needs the `through` object to describe the join table.
          through: {
            from: 'users_groups.groupId',
            to: 'users_groups.userId'
          },
          to: 'users.id'
        }
      }
    }
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name', 'description', 'doNotDisturb', 'tags', 'room', 'startDate', 'endDate'],

      properties: {
        id: { type: 'integer' },
        name: { type: 'string', minLength: 1, maxLength: 255 },
        description: { type: 'string' },
        doNotDisturb: { type: 'boolean' },
        tags: { type: 'string' },
        room: { type: 'integer' },
        startDate: { type: 'datetime' },
        endDate: { type: 'datetime' },
        maxAttendees: { type: 'integer' }
      }
    }
  }
}
