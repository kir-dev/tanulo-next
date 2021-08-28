import * as Knex from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('users', (table) => {
    table.dropColumn('admin')
    table
      .enu('role', ['ADMIN', 'TICKET_ADMIN', 'USER'], {
        useNative: true,
        enumName: 'role_type',
      })
      .defaultTo('USER')
      .notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('users', (table) => {
    table.dropColumn('role')
    table.boolean('admin')
  })
}
