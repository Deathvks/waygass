const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const adminRoutes = require('./routes/adminRoutes');
const db = require('./models');

const token = jwt.sign({ id: 1, role: 'admin' }, 'waygas_super_secret_key_2026', { expiresIn: '1d' });

app.use(express.json());
app.use('/api/admin', adminRoutes);

app.listen(3016, async () => {
  await db.sequelize.sync();
  const res = await fetch('http://localhost:3016/api/admin/stats', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  console.log(res.status);
  const text = await res.text();
  console.log(text);
  process.exit(0);
});
