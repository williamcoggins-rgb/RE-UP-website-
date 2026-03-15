var { Pool } = require('pg');

var pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 10,
  idleTimeoutMillis: 30000
});

pool.on('error', function (err) {
  console.error('Unexpected database error:', err.message);
});

module.exports = pool;
