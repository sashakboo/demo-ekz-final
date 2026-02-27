const { param } = require('express-validator');
const { Pool } = require('pg');

require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'demoekz-final',
  password: process.env.DB_PASSWORD || '11111',
  port: process.env.DB_PORT || '5432',
  ssl: {
    rejectUnauthorized: true
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
}