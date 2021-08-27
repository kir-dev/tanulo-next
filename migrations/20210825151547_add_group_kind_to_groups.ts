import * as Knex from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('groups', table => {
    table.enu('kind', ['CLASSIC', 'PRIVATE'], {
      useNative: true,
      enumName: 'group_kind'
    }).defaultTo('CLASSIC')
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('groups', table => {
    table.dropColumn('kind')
  })
}
