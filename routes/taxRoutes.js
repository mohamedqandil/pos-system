const express = require('express');
const router = express.Router();

const taxController = require('../controllers/taxController');

// 🟢 Create tax
router.post('/', taxController.createTax);

// 🟢 Get all taxes
router.get('/', taxController.getTaxes);

module.exports = router;