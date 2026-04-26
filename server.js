const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const app = express();
app.use(express.json());

const PORT = 3000;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'pos_system',
  password: 'Pos@2026',
  port: 5433,
});

app.post('/users', async (req, res) => {
  const { name, username, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (name, username, password, role)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, username, hashedPassword, role]
    );

    res.json(result.rows[0]);

  } catch (err) {
    if (err.code === '23505') {
      return res.send('❌ Username already exists');
    }

    console.log(err);
    res.send('Error ❌');
  }
});

app.listen(PORT, () => {
  console.log('🔥 NEW CLEAN SERVER RUNNING');
});