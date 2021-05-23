require('dotenv').config()
require('ts-node/register')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { knexSnakeCaseMappers } = require('objection')

module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'migrationTable',
      extension: 'ts',
      directory: './migrations'
    },
    ...knexSnakeCaseMappers()
  },
  production: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'migrationTable',
      extension: 'ts',
      directory: './migrations'
    },
    ...knexSnakeCaseMappers()
  },
  test: {
    client: 'sqlite3',
    connection: {
      filename: './SQLiteDB.db'
    },  
    useNullAsDefault: true,
    migrations: {
      tableName: 'migrationTable',
      extension: 'ts',
      directory: './migrations'
    },
    ...knexSnakeCaseMappers()
  }
}
