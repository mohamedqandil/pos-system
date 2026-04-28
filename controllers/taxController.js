const pool = require('../db');

// 🟢 Create Tax
exports.createTax = async (req, res) => {
  const { name, rate } = req.body || {};

  // 🛑 Validation
  if (!name || rate === undefined) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  if (isNaN(rate)) {
    return res.status(400).json({ message: 'Rate must be a number' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO taxes (name, rate)
       VALUES ($1, $2)
       RETURNING *`,
      [name, rate]
    );

    res.json(result.rows[0]);

  } catch (err) {
    console.error('Create Tax Error:', err.message);
    res.status(500).json({ message: err.message });
  }
};

// 🟢 Get Taxes
exports.getTaxes = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM taxes 
       WHERE is_active = true 
       ORDER BY id DESC`
    );

    res.json(result.rows);

  } catch (err) {
    console.error('Get Taxes Error:', err.message);
    res.status(500).json({ message: err.message });
  }
};