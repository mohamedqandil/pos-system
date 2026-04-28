const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres', // ✔ هذا فيه جدول taxes
  password: 'Pos@2026',
  port: 5433, // 👈 رجّعها 5433
});

module.exports = pool;