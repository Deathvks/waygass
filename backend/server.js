require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cron = require('node-cron');
const db = require('./models');
const { securityMiddleware, loadBlockedIPs } = require('./middlewares/securityMiddleware');
const { fetchAndStoreDailyPrices } = require('./services/cronService');

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const stationRoutes = require('./routes/stationRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(helmet());
app.use(cors());
app.use(express.json());

// Sincronizar Base de Datos
db.sequelize.sync().then(async () => {
  console.log("Conectado a la base de datos SQLite.");
  
  // Cargar IPs bloqueadas al inicio
  await loadBlockedIPs();
  
  try {
    const count = await db.PriceHistory.count();
    if (count === 0) {
      console.log("[INIT] Base de datos de histórico vacía. Ejecutando primera sincronización en segundo plano...");
      fetchAndStoreDailyPrices();
    }
  } catch(e) {
    console.error("Error al comprobar el histórico en el arranque:", e.message);
  }
}).catch(err => {
  console.error("Error al conectar con la base de datos: ", err.message);
});

// Middleware Global de Seguridad
app.use(securityMiddleware);

// Rutas
app.use('/api', authRoutes);
app.use('/api', stationRoutes); // includes /api/gas/FiltroProvincia and /api/history/:id
app.use('/api', userRoutes);    // includes /api/ranking, /api/validations, /api/favorites, /api/settings
app.use('/api/admin', adminRoutes);

// Ejecutar todos los días a las 03:00 AM
cron.schedule('0 3 * * *', () => {
  fetchAndStoreDailyPrices();
});

app.listen(PORT, () => {
  console.log(`Servidor Backend corriendo en el puerto ${PORT}.`);
});

