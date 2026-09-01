const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const adminRoutes = require('./routes/adminRoutes');
const db = require('./models');

// Patch adminRoutes to log the error
const fs = require('fs');
let code = fs.readFileSync('./routes/adminRoutes.js', 'utf8');
code = code.replace(`res.status(500).json({ error: 'Error obteniendo estadsticas.' });`, `console.error(error); res.status(500).json({ error: 'Error obteniendo estadsticas.' });`);
fs.writeFileSync('./routes/adminRoutes.js', code, 'utf8');

const token = jwt.sign({ id: 1, role: 'admin' }, 'waygas_super_secret_key_2026', { expiresIn: '1d' });

app.use(express.json());
app.use('/api/admin', adminRoutes);

app.listen(3017, async () => {
  await db.sequelize.sync();
  await fetch('http://localhost:3017/api/admin/stats', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  process.exit(0);
});
