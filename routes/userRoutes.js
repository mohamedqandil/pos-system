const express = require('express');
const router = express.Router();

const auth = require('../middleware/authMiddleware');
const permit = require('../middleware/roleMiddleware');

const userController = require('../controllers/userController');

// 🔥 Debug - تأكد إن الملف انحمّل
console.log('🔥 userRoutes LOADED');

// 🟢 Test route (مهم للتأكد)
router.get('/test', (req, res) => {
  res.send('TEST OK ✅');
});

// 🟢 Login (بدون حماية)
router.post('/login', userController.login);

// 🟢 Create user (admin only)
router.post('/', auth, permit('admin'), userController.createUser);

// 🟢 Get users (admin only)
router.get('/', auth, permit('admin'), userController.getUsers);

module.exports = router;