import * as Knex from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('groups', table => {
    table.integer('ownerId')
      .unsigned()
      .references('id')
      .inTable('users')
      .index()
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('groups', table => {
    table.dropColumn('ownerId')
      .dropIndex('ownerId')
  })
}
