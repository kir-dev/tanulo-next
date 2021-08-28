import * as Knex from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('tickets', table => {
    table.integer('userId')
      .unsigned()
      .references('id')
      .inTable('users')
      .index()
  })
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('tickets', table => {
    table.dropColumn('userId')
      .dropIndex('userId')
  })
}
