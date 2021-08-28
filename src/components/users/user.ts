import { Model } from 'objection'

import { Group } from '../groups/group'

export enum RoleType {
  ADMIN = 'ADMIN',
  TICKET_ADMIN = 'TICKET_ADMIN',
  USER = 'USER',
}

export class User extends Model {
  id!: number
  name: string
  email: string
  authSchId: string
  role: RoleType
  floor: number
  wantEmail: boolean
  groups: Group[]
  static get tableName(): string {
    return 'users'
  }

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  static get relationMappings(): Record<string, any> {
    return {
      groups: {
        relation: Model.ManyToManyRelation,
        modelClass: Group,

        join: {
          from: 'users.id',
          through: {
            from: 'users_groups.userId',
            to: 'users_groups.groupId',
          },
          to: 'groups.id',
        },
      },
    }
  }

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  static get jsonSchema(): Record<string, any> {
    return {
      type: 'object',
      required: ['name', 'email', 'authSchId'],

      properties: {
        id: { type: 'integer' },
        name: { type: 'string', minLength: 1, maxLength: 255 },
        authSchId: { type: 'string' },
        floor: { type: ['integer', 'null'] },
        wantEmail: { type: 'boolean' },
      },
    }
  }
}
