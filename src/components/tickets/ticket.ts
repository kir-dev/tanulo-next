import { Model } from 'objection'

export class Ticket extends Model {
  id!: number
  description: string
  roomNumber: number
  createdAt: Date

  $beforeInsert() {
    this.createdAt = new Date()
  }

  static get tableName() {
    return 'tickets'
  }

  static jsonSchema = {
    type: 'object',
    required: ['roomNumber', 'description'],

    properties: {
      id: { type: 'integer' },
      description: { type: 'string' },
      roomNumber: { type: 'integer' }
    }
  }
}
