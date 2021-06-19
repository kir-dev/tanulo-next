import { Model } from 'objection'

import { User } from '../users/user'

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
        maxAttendees: { type: 'integer' }
      }
    }
  }
}
