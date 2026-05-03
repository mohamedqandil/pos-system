const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: '127.0.0.1',
  database: 'pos_system',
  password: 'Pos@2026',
  port: 5433
});

// 🔥 هذا يحل مشاكل schema نهائياً
pool.query('SET search_path TO public');

module.exports = pool;