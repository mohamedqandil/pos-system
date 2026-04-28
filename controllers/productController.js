const pool = require('../db');

// 🟢 Create Product
exports.createProduct = async (req, res) => {
  const { name, barcode, price, cost, tax_id } = req.body || {};

  if (!name || !price) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO products (name, barcode, price, cost, tax_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name, barcode || null, price, cost || 0, tax_id || null]
    );

    res.json(result.rows[0]);

  } catch (err) {
    console.error('Create Product Error:', err.message);
    res.status(500).json({ message: err.message });
  }
};

// 🟢 Get Products
exports.getProducts = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, t.name AS tax_name, t.rate
       FROM products p
       LEFT JOIN taxes t ON p.tax_id = t.id
       WHERE p.is_active = true
       ORDER BY p.id DESC`
    );

    res.json(result.rows);

  } catch (err) {
    console.error('Get Products Error:', err.message);
    res.status(500).json({ message: err.message });
  }
};