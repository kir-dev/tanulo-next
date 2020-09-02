import { Model } from 'objection'

import { User } from '../users/user'

export class Favorite extends Model {
  id!: number
  room: number
  user: User
  static get tableName() {
    return 'favorites'
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,

        join: {
          from: 'favorites.userId',
          to: 'users.id'
        }
      }
    }
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['room'],

      properties: {
        id: { type: 'integer' },
        room: { type: 'integer' },
      }
    }
  }
}
