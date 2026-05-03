const pool = require('../db');

// 🟢 تنفيذ الدفع (يدعم الدفع الجزئي والكامل)
exports.payInvoice = async (req, res) => {
  try {
    const { invoice_id, amount, method } = req.body;

    const invoiceId = Number(invoice_id);
    const paymentAmount = Number(amount);
    const paymentMethod = typeof method === 'string' ? method.trim() : '';

    // ✅ validation
    if (
      !Number.isFinite(invoiceId) ||
      !Number.isFinite(paymentAmount) ||
      paymentAmount <= 0 ||
      !paymentMethod
    ) {
      return res.status(400).json({
        message: 'invoice_id, amount, method are required and must be valid'
      });
    }

    // 🟢 1. جلب الفاتورة
    const invoiceRes = await pool.query(
      'SELECT * FROM public.invoices WHERE id = $1',
      [invoiceId]
    );

    if (invoiceRes.rows.length === 0) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    const invoice = invoiceRes.rows[0];

    if (invoice.status === 'cancelled') {
      return res.status(400).json({ message: 'Invoice is cancelled' });
    }

    // 🟢 2. حساب المدفوع الحالي
    const paidRes = await pool.query(
      `SELECT COALESCE(SUM(amount),0) as total_paid
       FROM public.payments
       WHERE invoice_id = $1`,
      [invoiceId]
    );

    const currentPaid = parseFloat(paidRes.rows[0].total_paid);
    const invoiceTotal = parseFloat(invoice.total);
    const newTotal = currentPaid + paymentAmount;

    // ❌ منع الدفع الزائد
    if (newTotal > invoiceTotal) {
      return res.status(400).json({
        message: `Payment exceeds invoice total (${invoiceTotal})`
      });
    }

    // 🟢 3. تسجيل الدفع
    await pool.query(
      `INSERT INTO public.payments (invoice_id, amount, method)
       VALUES ($1, $2, $3)`,
      [invoiceId, paymentAmount, paymentMethod]
    );

    // 🟢 4. حساب المدفوع بعد الإضافة
    const paymentsSum = await pool.query(
      `SELECT COALESCE(SUM(amount),0) as total_paid
       FROM public.payments
       WHERE invoice_id = $1`,
      [invoiceId]
    );

    const totalPaid = parseFloat(paymentsSum.rows[0].total_paid);

    // 🟢 5. تحديد الحالة
    let newStatus = 'open';

    if (totalPaid >= invoiceTotal) {
      newStatus = 'paid';
    }

    // 🟢 6. تحديث الفاتورة
    await pool.query(
      `UPDATE public.invoices
       SET status = $1
       WHERE id = $2`,
      [newStatus, invoiceId]
    );

    // 🟢 response
    res.json({
      message: 'Payment recorded successfully',
      total_paid: totalPaid,
      invoice_total: invoiceTotal,
      remaining: invoiceTotal - totalPaid,
      status: newStatus
    });

  } catch (err) {
    console.error('🔥 PAYMENT ERROR:', err);
    res.status(500).json({ message: err.message });
  }
};