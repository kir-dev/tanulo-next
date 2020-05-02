import * as Knex from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .alterTable('tickets', table => {
      table.integer('roomNumber').notNullable().alter()
      table.string('description').notNullable().alter()
    })
    .alterTable('users', table => {
      table.string('name').notNullable().alter()
      table.string('email').notNullable().alter()
      table.string('authSchId').notNullable().alter()
    })
    .alterTable('groups', table => {
      table.string('name').notNullable().alter()
      table.dateTime('startDate').notNullable().alter()
      table.dateTime('endDate').notNullable().alter()
      table.integer('room').notNullable().alter()
      table.boolean('doNotDisturb').notNullable().alter()
    })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .alterTable('tickets', table => {
      table.integer('roomNumber').nullable().alter()
      table.string('description').nullable().alter()
    })
    .alterTable('users', table => {
      table.string('name').nullable().alter()
      table.string('email').nullable().alter()
      table.string('authSchId').nullable().alter()
    })
    .alterTable('groups', table => {
      table.string('name').nullable().alter()
      table.dateTime('startDate').nullable().alter()
      table.dateTime('endDate').nullable().alter()
      table.integer('room').nullable().alter()
      table.boolean('doNotDisturb').nullable().alter()
    })
}
