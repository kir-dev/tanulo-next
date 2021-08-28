import * as Knex from 'knex'


export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('tickets', table => {
    table.enu('status',
      [
        'SENT',
        'IN_PROGRESS',
        'DONE',
        'ARCHIVED'
      ],
      {
        useNative: true,
        enumName: 'status_type'
      })
      .defaultTo('SENT')
      .notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('tickets', table => {
    table.dropColumn('status')
  })
}

