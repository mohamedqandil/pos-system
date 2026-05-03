const pool = require('../db');

// 🟢 CREATE INVOICE
exports.createInvoice = async (req, res) => {
  try {
    const result = await pool.query(
      `INSERT INTO public.invoices
       (invoice_number, type, status, subtotal, tax_total, total, tax_status)
       VALUES ($1, $2, 'draft', 0, 0, 0, $3)
       RETURNING *`,
      [null, 'sale', 'taxable']
    );

    return res.json(result.rows[0]);

  } catch (err) {
    console.error('🔥 CREATE ERROR:', err);
    return res.status(500).json({ message: err.message });
  }
};

// 🟢 ADD ITEM + CORE LOCK
exports.addItemToInvoice = async (req, res) => {
  try {
    console.log('🔥 CORE LOCK ADD ITEM');

    const { invoice_id, product_id, quantity } = req.body;

    const invoiceId = Number(invoice_id);
    const productId = Number(product_id);
    const qty = Number(quantity);

    // ✅ validation
    if (
      !Number.isFinite(invoiceId) ||
      !Number.isFinite(productId) ||
      !Number.isFinite(qty) ||
      qty <= 0
    ) {
      return res.status(400).json({ message: 'Invalid input' });
    }

    // 🟢 get product
    const productRes = await pool.query(
      'SELECT * FROM public.products WHERE id = $1',
      [productId]
    );

    if (productRes.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const p = productRes.rows[0];

    const price = Number(p.price || 0);
    const taxRate = Number(p.tax_rate || 0);

    const taxAmount = price * (taxRate / 100) * qty;
    const total = (price * qty) + taxAmount;

    // 🟢 insert item
    await pool.query(
      `INSERT INTO public.invoice_items
      (invoice_id, product_id, product_name, quantity, price_before_tax, tax_amount, total)
      VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [
        invoiceId,
        productId,
        p.name,
        qty,
        price,
        taxAmount,
        total
      ]
    );

    // 🟢 recalc totals (CORE LOCK)
    const sum = await pool.query(
      `SELECT 
        COALESCE(SUM(price_before_tax * quantity),0) AS subtotal,
        COALESCE(SUM(tax_amount),0) AS tax_total,
        COALESCE(SUM(total),0) AS total
       FROM public.invoice_items
       WHERE invoice_id = $1`,
      [invoiceId]
    );

    const subtotal = Number(sum.rows[0].subtotal);
    const tax_total = Number(sum.rows[0].tax_total);
    const total_invoice = Number(sum.rows[0].total);

    await pool.query(
      `UPDATE public.invoices
       SET subtotal = $1,
           tax_total = $2,
           total = $3
       WHERE id = $4`,
      [subtotal, tax_total, total_invoice, invoiceId]
    );

    return res.json({
      message: 'Item added + invoice updated ✅',
      invoice: {
        subtotal,
        tax_total,
        total: total_invoice
      }
    });

  } catch (err) {
    console.error('🔥 ADD ITEM ERROR:', err);
    return res.status(500).json({ message: err.message });
  }
};

// 🟢 GET INVOICE
exports.getInvoiceById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const inv = await pool.query(
      'SELECT * FROM public.invoices WHERE id = $1',
      [id]
    );

    const items = await pool.query(
      'SELECT * FROM public.invoice_items WHERE invoice_id = $1',
      [id]
    );

    return res.json({
      invoice: inv.rows[0],
      items: items.rows
    });

  } catch (err) {
    console.error('🔥 GET ERROR:', err);
    return res.status(500).json({ message: err.message });
  }
};