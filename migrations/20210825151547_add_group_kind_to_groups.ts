import * as Knex from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('groups', table => {
    table.enu('type', ['CLASSIC', 'PRIVATE'], {
      useNative: true,
      enumName: 'group_type'
    }).defaultTo('CLASSIC')
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('groups', table => {
    table.dropColumn('type')
  })
}
