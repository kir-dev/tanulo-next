import * as Knex from 'knex'


export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable('favorites', table => {
      table.increments('id').primary()

      table.unique(['userId', 'room'])

      table
        .integer('userId')
        .unsigned()
        .references('id')
        .inTable('users')
        .index()

      table
        .integer('room')
        .notNullable()
    })
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .dropTableIfExists('favorites')
}

