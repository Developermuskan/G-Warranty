const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,  // Render External DB URL
  ssl: {
    rejectUnauthorized: false   // required for Render's SSL
  }
});

// Test the connection
pool.connect()
  .then(() => console.log('✅ Connected to Render PostgreSQL securely'))
  .catch(err => console.error('❌ Connection error', err));

module.exports = pool;
