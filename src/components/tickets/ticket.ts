import { Model } from 'objection'

export enum StatusType { 
  SENT = 'SENT',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
  ARCHIVED ='ARCHIVED'
}

export class Ticket extends Model {
  id!: number
  description: string
  roomNumber: number
  status: StatusType
  createdAt: Date
  userId: number

  $beforeInsert() {
    this.createdAt = new Date()
  }

  static get tableName() {
    return 'tickets'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['roomNumber', 'description', 'userId'],

      properties: {
        id: { type: 'integer' },
        description: { type: 'string' , maxLenght: 500 },
        roomNumber: { type: 'integer' },
        status: { type: 'string' },
        userId: { type: 'integer' },
      }
    }
  }
}
