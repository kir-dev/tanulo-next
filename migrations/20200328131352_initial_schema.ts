import * as Knex from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable('tickets', (table) => {
      table.increments('id').primary()

      table.string('description')
      table.integer('roomNumber')
      table.dateTime('createdAt')
    })
    .createTable('users', (table) => {
      table.increments('id').primary()

      table.string('name')
      table.string('email')
      table.string('authSchId')
      table.boolean('admin')
    })
    .createTable('groups', (table) => {
      table.increments('id').primary()

      table.string('name')
      table.string('subject')
      table.string('description')
      table.dateTime('startDate')
      table.dateTime('endDate')
      table.integer('room')
      table.boolean('doNotDisturb')
      table.dateTime('createdAt')
    })
    .createTable('users_groups', (table) => {
      table.increments('id').primary()

      table
        .integer('userId')
        .unsigned()
        .references('id')
        .inTable('users')
        .index()

      table
        .integer('groupId')
        .unsigned()
        .references('id')
        .inTable('groups')
        .index()
    })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .dropTableIfExists('users_groups')
    .dropTableIfExists('tickets')
    .dropTableIfExists('users')
    .dropTableIfExists('groups')
}
