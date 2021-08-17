import * as Knex from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('users', table => {
    table.boolean('wantEmail')
      .defaultTo(true)
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('users', table => {
    table.dropColumn('wantEmail')
  })
}
