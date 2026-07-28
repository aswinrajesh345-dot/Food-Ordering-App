const { Pool } = require('pg');

const defaultUser = process.env.USER || process.env.USERNAME || 'postgres';
const connectionString = process.env.DATABASE_URL || `postgres://${defaultUser}@localhost:5432/food_delivery`;

const pool = new Pool({
  connectionString,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
