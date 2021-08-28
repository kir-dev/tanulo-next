import * as Knex from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('groups', (table) => {
    table.integer('room').nullable().alter()
    table.string('link')
    table.string('place')
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('groups', (table) => {
    table.integer('room').notNullable().alter()
    table.dropColumn('link')
    table.dropColumn('place')
  })
}
