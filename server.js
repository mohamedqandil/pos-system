require('dotenv').config();

const express = require('express');
const app = express();
app.use(express.json());

// 🟢 DB Test
const pool = require('./db');

pool.query('SELECT * FROM taxes')
  .then(res => console.log('DB OK:', res.rows))
  .catch(err => console.error('DB ERROR:', err.message));

// 🟢 Routes
const userRoutes = require('./routes/userRoutes');
const taxRoutes = require('./routes/taxRoutes');
const productRoutes = require('./routes/productRoutes'); // 👈 أضفنا هذا

// 🟢 Test route
app.get('/', (req, res) => {
  res.send('API Working ✅');
});

// 🟢 Use routes
app.use('/users', userRoutes);
app.use('/taxes', taxRoutes);
app.use('/products', productRoutes); // 👈 أضفنا هذا

// 🟢 Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('🔥 SERVER RUNNING ON PORT ' + PORT);
});