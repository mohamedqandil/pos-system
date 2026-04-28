const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');

const SECRET = 'mysecretkey';

// 🟢 Create user
exports.createUser = async (req, res) => {
  const { name, username, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (name, username, password, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, username, role`,
      [name, username, hashedPassword, role]
    );

    res.json(result.rows[0]);

  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ message: '❌ Username already exists' });
    }

    res.status(500).json({ message: err.message });
  }
};

// 🟢 Login
exports.login = async (req, res) => {
  const { username, password } = req.body;

  const result = await pool.query(
    'SELECT * FROM users WHERE username = $1',
    [username]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ message: '❌ User not found' });
  }

  const user = result.rows[0];

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({ message: '❌ Wrong password' });
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    SECRET,
    { expiresIn: '1h' }
  );

  res.json({ message: 'Login successful ✅', token });
};

// 🟢 Get users
exports.getUsers = async (req, res) => {
  const result = await pool.query(
    'SELECT id, name, username, role FROM users'
  );

  res.json(result.rows);
};