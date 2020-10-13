import * as Knex from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('users', table => {
    table.dropColumn('floor')
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('users', table => {
    table.integer('floor')
      .unsigned()
      .nullable()
  })
}
