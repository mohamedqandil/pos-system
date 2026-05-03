const pool = require('./db');
(async () => {
  try {
    const invoice = await pool.query('SELECT id,status,total FROM public.invoices WHERE id = $1', [1]);
    console.log('invoice:', invoice.rows);
    const payments = await pool.query('SELECT id,invoice_id,amount,method,created_at FROM public.payments WHERE invoice_id = $1', [1]);
    console.log('payments:', payments.rows);
  } catch (err) {
    console.error('ERROR:', err);
  } finally {
    await pool.end();
  }
})();
