const express = require('express');
const { Pool } = require('pg');

const app = express();
const PORT = 3000;

// الاتصال مع PostgreSQL
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'pos_system',
    password: 'Pos@2026', // حط الباسورد تبعك
    port: 5432,
});

// اختبار الاتصال
app.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.send('Database Connected 🚀 ' + result.rows[0].now);
    } catch (err) {
        res.send('Database Error ❌ ' + err.message);
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});