import * as Knex from 'knex'

const ENUM_VALUES = ['OWNER', 'MEMBER', 'UNAPPROVED']
const ENUM_CONFIG = { useNative: true, enumName: 'group_roles' }
export async function up(knex: Knex): Promise<void> {
  // create role
  await knex.schema.alterTable('users_groups', (table) =>
    table
      .enu('group_role', ENUM_VALUES, ENUM_CONFIG)
      .defaultTo('MEMBER')
      .notNullable()
  )

  // save owners
  const ownerJoins = knex('users_groups')
    .select('users_groups.id')
    .join('groups', 'group_id', '=', 'groups.id')
    .whereRaw('user_id = owner_id')

  await knex('users_groups')
    .update('group_role', 'OWNER')
    .where('id', 'in', ownerJoins)
}

export async function down(knex: Knex): Promise<void> {
  // TODO: drop enum `group_roles`

  await knex.schema.alterTable('users_groups', (table) => {
    table.dropColumn('group_role')
  })
}
