const express = require('express');
const router = express.Router();

const {
  createInvoice,
  addItemToInvoice,
  getInvoiceById
} = require('../controllers/invoiceController');

// TEST
router.get('/test', (req, res) => {
  res.json({ message: 'Invoice route working ✅' });
});

router.post('/create', createInvoice);
router.post('/add-item', addItemToInvoice);
router.get('/:id', getInvoiceById);

module.exports = router;