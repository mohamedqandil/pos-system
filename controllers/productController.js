const pool = require('../db');

// 🟢 Create Product
exports.createProduct = async (req, res) => {
  try {
    const { name, barcode, price, cost, tax_id } = req.body;

    if (!name || !price) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const result = await pool.query(
      `INSERT INTO public.products (name, barcode, price, cost, tax_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name, barcode || null, price, cost || 0, tax_id || null]
    );

    res.json(result.rows[0]);

  } catch (err) {
    console.error('🔥 PRODUCT CREATE ERROR:', err);
    res.status(500).json({ message: err.message });
  }
};

// 🟢 Get Products
exports.getProducts = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM public.products ORDER BY id DESC`
    );

    res.json(result.rows);

  } catch (err) {
    console.error('🔥 GET PRODUCTS ERROR:', err);
    res.status(500).json({ message: err.message });
  }
};