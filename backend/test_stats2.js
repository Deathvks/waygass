const express = require('express');
const app = express();
const adminRoutes = require('./routes/adminRoutes');
const db = require('./models');

app.use(express.json());
// Mock middleware
app.use((req, res, next) => { req.user = { role: 'admin' }; next(); });
app.use('/api/admin', adminRoutes);

app.listen(3015, async () => {
  await db.sequelize.sync();
  console.log("Testing /api/admin/stats");
  const res = await fetch('http://localhost:3015/api/admin/stats');
  console.log(res.status);
  const text = await res.text();
  console.log(text);
  process.exit(0);
});
