// config/postgresdb.js
const { Pool } = require('pg');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

const pool = new Pool(
  isProduction
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
      }
    : {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        port: process.env.DB_PORT,
      }
);

pool
  .connect()
  .then(() =>
    console.log(
      `✅ Connected to PostgreSQL (${isProduction ? 'Render DB' : 'Local DB'})`
    )
  )
  .catch((err) => console.error('❌ DB connection error:', err.message));

module.exports = pool;
