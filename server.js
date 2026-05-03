require('dotenv').config();

const express = require('express');
const app = express();

app.use(express.json());

// LOG REQUESTS
app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.url}`);
  next();
});

// ROOT
app.get('/', (req, res) => {
  res.send('API Working ✅');
});

// ROUTES
const invoiceRoutes = require('./routes/invoiceRoutes');
app.use('/invoices', invoiceRoutes);

// 404
app.use((req, res) => {
  res.status(404).send('Not Found ❌');
});

// START SERVER
app.listen(3000, () => {
  console.log('🔥 SERVER RUNNING ON PORT 3000');
});