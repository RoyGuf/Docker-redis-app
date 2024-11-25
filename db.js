const { Pool } = require('pg');
const pool = new Pool({
  host: process.env.NODE_ENV == "development" ? 'localhost' : 'postgres',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'gufa1918'
});

module.exports = pool;