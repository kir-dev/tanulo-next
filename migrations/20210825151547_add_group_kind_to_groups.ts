import * as Knex from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('groups', table => {
    table.enu('kind', ['classic', 'anonymous'], {
      useNative: true,
      enumName: 'group_kind'
    }).defaultTo('classic')
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('groups', table => {
    table.dropColumn('kind')
  })
}
