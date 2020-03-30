import { Model } from 'objection'

import { Group } from '../groups/group'

export class User extends Model {
  id!: number
  name: string
  email: string
  authSchId: string
  admin: boolean
  groups: Group[]
  static get tableName() {
    return 'users'
  }

  static get relationMappings() {
    return {
      groups: {
        relation: Model.ManyToManyRelation,
        modelClass: Group,

        join: {
          from: 'users.id',
          through: {
            from: 'users_groups.userId',
            to: 'users_groups.groupId'
          },
          to: 'groups.id'
        }
      }
    }
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name', 'email', 'authSchId'],

      properties: {
        id: { type: 'integer' },
        name: { type: 'string', minLength: 1, maxLength: 255 },
        authSchId: { type: 'string' }
      }
    }
  }
}
