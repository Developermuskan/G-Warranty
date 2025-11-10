// db.js
const { Pool } = require("pg");
require("dotenv").config();

const isProduction = process.env.NODE_ENV === "production";

const pool = new Pool(
  isProduction
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }, // required for Render DB
      }
    : {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        port: process.env.DB_PORT,
      }
);

// Simple check for which DB is connected
const dbName = isProduction ? "Render Database" : "Local PostgreSQL";

pool
  .connect()
  .then(() => console.log(`✅ Connected to ${dbName}`))
  .catch((err) => console.error("❌ DB connection error", err));

module.exports = pool;
