import * as Knex from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('_prisma_migrations', (table) => {
    table.string('id', 36).primary()
    table.string('checksum', 64).notNullable()
    table.timestamp('finished_at')
    table.string('migration_name', 255).notNullable()
    table.string('logs')
    table.timestamp('rolled_back_at')
    table.timestamp('started_at').notNullable()
    table.integer('applied_steps_count')
  })

  return knex.table('_prisma_migrations').insert([
    {
      id: 'ec605277-3fd7-436b-814d-7a7806f23b3f',
      checksum: '66517a5cc09d205d5e0ce783c6a66829c4991ae1aaa29d7b05dc3734aeb709d1',
      migration_name: '20200328131352_initial_schema',
      applied_steps_count: 1,
      started_at: new Date(),
      finished_at: new Date()
    },
    {
      id: '46631492-c804-4f1a-85b8-a909b62837fc',
      checksum: 'afee0d4c885c333b31f4b016fa7602d8c6c2420b3fb2a6512f94fec03fd4b5af',
      migration_name: '20200328173956_add_owner_id_to_group',
      applied_steps_count: 1,
      started_at: new Date(),
      finished_at: new Date()
    },
    {
      id: '23daa180-0ef6-4e32-8e8a-3c38d611f0de',
      checksum: 'c1d348b0b81e2f43c3bd5e048eb78b03098c51533053ac0b072a50a453a15f2f',
      migration_name: '20200408124626_add_non_nullable',
      applied_steps_count: 1,
      started_at: new Date(),
      finished_at: new Date()
    },
    {
      id: '164d5175-407a-4534-b9b5-74f362d02260',
      checksum: '2cbb2f78fd00d6da87010bfc68779afd4fa10e2beba797422789ae6949ab6be1',
      migration_name: '20200510001427_add_floor_to_profile',
      applied_steps_count: 1,
      started_at: new Date(),
      finished_at: new Date()
    },
    {
      id: 'a2c12db3-ef64-4c7f-9a75-a35df6c8c27d',
      checksum: 'adc769d24b44e029aeadfc17e5239bd4dc9fe140830b1d3907df07a103f59a3d',
      migration_name: '20200527121145_rename_column_in_groups',
      applied_steps_count: 1,
      started_at: new Date(),
      finished_at: new Date()
    },
    {
      id: '945f1416-bae3-43ac-8c79-7eba59c6b70e',
      checksum: 'b9ea38b901440a825c37b4344d85f6c869a3e32fc021576d4436066aee01b6de',
      migration_name: '20200721213650_update_description_lengths',
      applied_steps_count: 1,
      started_at: new Date(),
      finished_at: new Date()
    },
    {
      id: '62fd4180-f9a4-4763-848b-530c22508a07',
      checksum: '9bccdccb9d26d0ce4fbb40cf15e2a96e8b92205db377d9c89d7094e05e00c235',
      migration_name: '20200828113656_migration_add_status_for_tickets',
      applied_steps_count: 1,
      started_at: new Date(),
      finished_at: new Date()
    },
    {
      id: '0cc14462-e876-4ac6-9e3b-f8785df7d61f',
      checksum: '64c27a4a9419cffb52cb11fc7b3c1faec6d563f90952663f97563d2b32b78d1a',
      migration_name: '20201012224257_add_max_attendees',
      applied_steps_count: 1,
      started_at: new Date(),
      finished_at: new Date()
    },
    {
      id: '99837065-b062-4da7-be83-f66085485b49',
      checksum: '20c03bfcf56907fd44992d0b090fd178e6fd755df0c056aea0988c24b7ee11ca',
      migration_name: '20201013225752_add_role_to_user',
      applied_steps_count: 1,
      started_at: new Date(),
      finished_at: new Date()
    },
    {
      id: '74f11458-b655-4076-9392-586967faafa4',
      checksum: '33c7c37d36bd1976edb134eb0e538bed166ccce6cc49dd5a0226444c9f4d948a',
      migration_name: '20210418152354_add_user_id_to_tickets',
      applied_steps_count: 1,
      started_at: new Date(),
      finished_at: new Date()
    },
    {
      id: '07df2122-3d22-43d5-a0b0-439bf656b8f7',
      checksum: 'ac35a78a746ad8b4fcbc87c0ed2e7ccbd29e081b4cfb80ee225a67f9695ea936',
      migration_name: '20210611222535_add_place_and_link_to_groups',
      applied_steps_count: 1,
      started_at: new Date(),
      finished_at: new Date()
    },
    {
      id: '70e518c8-91ae-4af0-9570-78094b14ea2b',
      checksum: 'e47909787202b22822dd4395b865fcde2eb24b3d43dcc263cd78dde8ae4853c8',
      migration_name: '20210626192847_add_wantemail_to_user',
      applied_steps_count: 1,
      started_at: new Date(),
      finished_at: new Date()
    },
    {
      id: '66fdb87d-2b6a-4567-b455-70e27323de2c',
      checksum: '374da65652aaf3e425b0cde5169cfeb799853e9ac958119fc46a3673085406fd',
      migration_name: '20210829032204_insert_mocked_prisma_migration_logs',
      applied_steps_count: 1,
      started_at: new Date(),
      finished_at: new Date()
    },
  ])
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('_prisma_migrations')
}

