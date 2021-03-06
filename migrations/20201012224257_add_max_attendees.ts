import * as Knex from 'knex'


export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('groups', table => {
    table.integer('max_attendees').defaultTo(100)
  })
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('groups', table => {
    table.dropColumn('max_attendees')
  })
}

