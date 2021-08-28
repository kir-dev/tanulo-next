import * as Knex from 'knex'

export async function up(knex: Knex): Promise<void[]> {
  return Promise.all([
    knex.schema.alterTable('groups', (table) => {
      table.string('description', 500).alter()
    }),
    knex.schema.alterTable('tickets', (table) => {
      table.string('description', 500).alter()
    }),
  ])
}

export async function down(knex: Knex): Promise<void[]> {
  return Promise.all([
    knex.schema.alterTable('groups', (table) => {
      table.string('description').alter()
    }),
    knex.schema.alterTable('tickets', (table) => {
      table.string('description').alter()
    }),
  ])
}
