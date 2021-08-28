import * as Knex from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('groups', table => {
    table.renameColumn('subject', 'tags')
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('groups', table => {
    table.renameColumn('tags', 'subject')
  })
}
