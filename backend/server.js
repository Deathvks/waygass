require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const db = require('./models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cron = require('node-cron');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const User = db.users; 
const PriceHistory = db.PriceHistory;
const Favorite = db.Favorite;
const Validation = db.Validation;

const JWT_SECRET = process.env.JWT_SECRET || 'waygas_super_secret_key_2026';

// Configuración SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.dondominio.com',
  port: process.env.SMTP_PORT || 587,
  secure: process.env.SMTP_PORT == 465, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || 'info@waygass.es',
    pass: process.env.SMTP_PASS || 'TUPASSWORD_AQUI'
  }
});

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

// Sincronizar Base de Datos
db.sequelize.sync().then(async () => {
  // BORRAR y recrear la tabla PriceHistory para arreglar el schema roto en producción
  console.log("Forzando recreación de la tabla PriceHistory...");
  await db.PriceHistory.sync({ force: true });

  console.log("Conectado a la base de datos SQLite.");
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

// ==========================================
// Proxy para la API de MITECO (Evitar CORS)
// ==========================================
const API_BASE = 'https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/';

const apiCache = {};
let lastCronError = null;

app.get('/api/debug-db', async (req, res) => {
  try {
    const totalRows = await db.PriceHistory.count();
    const distinctStations = await db.PriceHistory.count({ col: 'stationId', distinct: true });
    const schema = await db.sequelize.query("SELECT sql FROM sqlite_master WHERE type='table' AND name='PriceHistories'", { type: db.sequelize.QueryTypes.SELECT });
    const records = await db.PriceHistory.findAll({ limit: 5 });
    res.json({ totalRows, distinctStations, schema, records });
  } catch(e) {
    res.json({ error: e.message });
  }
});

app.get('/api/gas/FiltroProvincia/:provincia', async (req, res) => {
  try {
    const { provincia } = req.params;
    const now = Date.now();
    
    if (apiCache[provincia] && (now - apiCache[provincia].timestamp < 1800000)) {
      return res.json(apiCache[provincia].data);
    }

    const response = await axios.get(`${API_BASE}FiltroProvincia/${provincia}`, {
      headers: { 'Accept': 'application/json' }
    });
    
    apiCache[provincia] = {
      data: response.data,
      timestamp: now
    };
    
    res.json(response.data);
  } catch (error) {
    console.error("Error en el proxy de MITECO:", error.message);
    res.status(500).json({ error: "Error obteniendo datos de MITECO" });
  }
});

// ==========================================
// Histórico y Auto-alimentación (Cron)
// ==========================================

// Parsear número español (ej: "1,452" -> 1.452)
const parsePrice = (str) => {
  if (!str) return null;
  const val = parseFloat(str.toString().replace(',', '.').trim());
  return isNaN(val) || val <= 0 ? null : val;
};

// Función para guardar los precios actuales en la DB
const fetchAndStoreDailyPrices = async () => {
  let success = false;
  let message = "";
  try {
    console.log("[CRON] Iniciando descarga diaria de precios para el histórico...");
    
    
    // El endpoint para TODA España es: 
    // https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/
    const allStationsRes = await axios.get(API_BASE, { 
        headers: { 
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
          'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8'
        }
      });
    
    if (allStationsRes.data && allStationsRes.data.ListaEESSPrecio) {

      const stations = allStationsRes.data.ListaEESSPrecio;
      const today = new Date().toISOString().split('T')[0];
      const records = [];
      for (const s of stations) {
        const id = s['IDEESS'];
        const p95 = parsePrice(s['Precio Gasolina 95 E5']);
        const pdiesel = parsePrice(s['Precio Gasoleo A']);
        
        if (id && (p95 || pdiesel)) {
          records.push({
            stationId: id.toString(),
            date: today,
            price95: p95,
            priceDiesel: pdiesel
          });
        }
      }
      
      // Upsert masivo (muchísimo más rápido en SQLite que insertar uno a uno)
      // Eliminar duplicados en el mismo array por si MITECO devuelve la misma gasolinera 2 veces hoy
        const seen = new Set();
        const uniqueRecords = [];
        for (const r of records) {
          const key = r.stationId + '_' + r.date;
          if (!seen.has(key)) {
            seen.add(key);
            uniqueRecords.push(r);
          }
        }
        
        await db.PriceHistory.bulkCreate(uniqueRecords, {
          ignoreDuplicates: true,
          validate: false
        });
        
        const inserted = uniqueRecords.length;
      
      lastCronError = null;
        
      console.log(`[CRON] Histórico guardado. ${inserted} gasolineras procesadas.`);
const totalRows = await db.PriceHistory.count();
console.log(`[CRON] TOTAL ROWS IN DB NOW: ${totalRows}`);
const schema = await db.sequelize.query("SELECT sql FROM sqlite_master WHERE type='table' AND name='PriceHistories'", { type: db.sequelize.QueryTypes.SELECT });
console.log(`[CRON] SCHEMA: ${JSON.stringify(schema)}`);
      
        success = true;
        message = `${inserted} gasolineras guardadas.`;
      } else {
        const errorMsg = "La API de MITECO no devolvió la lista esperada. Respuesta: " + (typeof allStationsRes.data === 'string' ? allStationsRes.data.substring(0, 100) : JSON.stringify(allStationsRes.data).substring(0, 100));
        console.error("[CRON]", errorMsg);
        lastCronError = errorMsg;
        message = errorMsg;
      }
      return { success, message };
  } catch (error) {
    console.error("[CRON] Error descargando precios diarios:", error.name, error.message, "PARENT:", error.parent ? error.parent.message : "No parent", "SQL:", error.sql || "No SQL");
  }
};

// Ejecutar todos los días a las 03:00 AM
cron.schedule('0 3 * * *', () => {
  fetchAndStoreDailyPrices();
});

// Endpoint para obtener histórico de 30 días de una estación
app.get('/api/history/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Buscar historial en BD
    let history = await db.PriceHistory.findAll({
      where: { stationId: id.toString() },
      order: [['date', 'ASC']],
      limit: 30
    });

    res.json(history);
  } catch (error) {
    console.error("Error obteniendo histórico:", error.message);
    res.status(500).json({ error: "Error obteniendo el histórico" });
  }
});

// ==========================================
// Middleware de Autenticación
// ==========================================
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: "Acceso denegado. Token no proporcionado." });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch (err) {
    res.status(401).json({ error: "Token inválido o expirado." });
  }
};

const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ error: "Acceso denegado. Se requieren permisos de administrador." });
    }
  });
};

// ==========================================
// Endpoints de Administración (Protegidos)
// ==========================================
app.get('/api/admin/force-history-sync', verifyAdmin, async (req, res) => {
  try {
    const result = await fetchAndStoreDailyPrices();
    if (result && result.success) {
      res.json({ message: result.message });
    } else {
      res.status(500).json({ error: "Error de la API del Ministerio: " + (result ? result.message : "Desconocido") });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/admin/stats', verifyAdmin, async (req, res) => {
  try {
    const totalUsers = await User.count();
    const proUsers = await User.count({ where: { subscription: 'pro' } });
    const totalValidations = await Validation.count();
    
    // Nmero de gasolineras nicas en el histrico
    const totalStations = await db.PriceHistory.count({
      col: 'stationId',
      distinct: true
    });
    
    // ltima actualizacin
    const lastUpdate = await db.PriceHistory.max('createdAt');

    res.json({
        totalUsers,
        proUsers,
        totalValidations,
        totalStations: totalStations || 0,
        debugTotalRows: await db.PriceHistory.count(),
        debugSchema: await db.sequelize.query("SELECT sql FROM sqlite_master WHERE type='table' AND name='PriceHistories'", { type: db.sequelize.QueryTypes.SELECT }),

        lastStationUpdate: lastUpdate || null,
        lastCronError: lastCronError || ("Rows: " + await db.PriceHistory.count() + " | Schema: " + JSON.stringify(await db.sequelize.query("SELECT sql FROM sqlite_master WHERE type='table' AND name='PriceHistories'", { type: db.sequelize.QueryTypes.SELECT })))
      });
  } catch (e) {
    res.status(500).json({ error: "Error obteniendo estadísticas." });
  }
});

app.get('/api/admin/users', verifyAdmin, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'lastName', 'email', 'subscription', 'role', 'createdAt']
    });
    res.json(users);
  } catch (e) {
    res.status(500).json({ error: "Error obteniendo usuarios." });
  }
});

app.delete('/api/admin/users/:id', verifyAdmin, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    if (userId === req.user.id) {
      return res.status(400).json({ error: "No puedes eliminar tu propia cuenta de administrador." });
    }
    
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }
    
    await user.destroy();
    res.json({ message: "Usuario eliminado correctamente." });
  } catch (e) {
    res.status(500).json({ error: "Error eliminando usuario." });
  }
});

app.patch('/api/admin/users/:id/role', verifyAdmin, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { role } = req.body;
    
    if (userId === req.user.id) {
      return res.status(400).json({ error: "No puedes cambiarte el rol a ti mismo." });
    }
    
    if (role !== 'admin' && role !== 'user') {
      return res.status(400).json({ error: "Rol inválido." });
    }
    
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }
    
    user.role = role;
    await user.save();
    res.json({ message: "Rol actualizado correctamente.", user });
  } catch (e) {
    res.status(500).json({ error: "Error actualizando rol." });
  }
});

// Endpoint temporal para convertir un usuario en administrador (Solo para pruebas/inicialización)
app.get('/api/admin/make-me-admin/:email', async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.params.email } });
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    
    user.role = 'admin';
    await user.save();
    res.json({ message: `¡Usuario ${user.email} ascendido a Administrador!` });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ==========================================
// Rutas de Autenticación
// ==========================================
  app.post('/api/register', async (req, res) => {
    try {
      const { name, lastName, email, password, rememberMe } = req.body;
      const expiresIn = rememberMe ? '30d' : '7d';
      
      console.log(`[AUTH] Intento de registro para email: ${email}`);

    // Validación básica
    if (!name || !lastName || !email || !password) {
      console.warn(`[AUTH-ERROR] Registro fallido: Campos incompletos.`);
      return res.status(400).json({ error: "Todos los campos son obligatorios." });
    }

    const passwordRules = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password)
    };

    if (!Object.values(passwordRules).every(Boolean)) {
      console.warn(`[AUTH-ERROR] Registro fallido: Contraseña débil para ${email}.`);
      return res.status(400).json({ error: "La contraseña no cumple todos los requisitos de seguridad." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.warn(`[AUTH-ERROR] Registro fallido: Formato de email inválido (${email}).`);
      return res.status(400).json({ error: "Formato de correo electrónico inválido." });
    }
    
    // Verificar si existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      console.warn(`[AUTH-ERROR] Registro fallido: El email ya existe (${email}).`);
      return res.status(400).json({ error: "El correo electrónico ya está registrado." });
    }

    // Hashear contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generar token de verificación
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Crear usuario
    const newUser = await User.create({
      name,
      lastName,
      email,
      password: hashedPassword,
      isVerified: false,
      verificationToken,
      role: email === 'dylanjesussuarez@gmail.com' ? 'admin' : 'user',
      subscription: email === 'dylanjesussuarez@gmail.com' ? 'pro' : 'free'
    });

    console.log(`[AUTH-SUCCESS] Usuario registrado correctamente: ${newUser.id} (${email}) - Pendiente de verificación`);

    // Enviar correo de verificación
    const frontendUrl = process.env.NODE_ENV === 'production' ? 'https://waygass.es' : 'http://localhost:5173';
    const verifyUrl = `${frontendUrl}/verify?token=${verificationToken}`;

    const mailOptions = {
      from: process.env.SMTP_USER || 'info@waygass.es',
      to: email,
      subject: 'Verifica tu cuenta en WayGass',
      html: `
        <div style="font-family: Arial, sans-serif; text-align: center; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #f97316;">¡Bienvenido a WayGass, ${name}!</h2>
          <p>Gracias por registrarte. Para poder iniciar sesión y empezar a ahorrar en combustible, por favor verifica tu cuenta haciendo clic en el siguiente botón:</p>
          <a href="${verifyUrl}" style="display: inline-block; margin: 20px 0; padding: 12px 24px; background-color: #f97316; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">Verificar Cuenta</a>
          <p style="font-size: 12px; color: #666;">Si no te has registrado en WayGass, puedes ignorar este correo.</p>
        </div>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`[AUTH-MAIL] Correo de verificación enviado a ${email}`);
    } catch (mailError) {
      console.error(`[AUTH-MAIL-ERROR] No se pudo enviar el correo a ${email}:`, mailError);
      // Opcional: Podríamos borrar el usuario o decirle que lo intente luego, pero para este caso lo dejamos registrado
    }
    
    res.json({
      status: 'verification_required',
      message: 'Usuario registrado. Por favor, revisa tu correo electrónico para verificar tu cuenta.'
    });
  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({ error: "Error interno del servidor al registrarse." });
  }
});

  // Verificar email
  app.get('/api/verify', async (req, res) => {
    try {
      const { token } = req.query;
      if (!token) return res.status(400).json({ error: 'Token no proporcionado.' });

      const user = await User.findOne({ where: { verificationToken: token } });
      if (!user) {
        return res.status(400).json({ error: 'Token inválido o expirado.' });
      }

      user.isVerified = true;
      user.verificationToken = null;
      await user.save();

      res.json({ message: 'Correo verificado exitosamente.' });
    } catch (error) {
      console.error('Error verificando email:', error);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  });
  // Reenviar email de verificación
  app.post('/api/resend-verification', async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ error: 'Email requerido.' });

      const user = await User.findOne({ where: { email } });
      if (!user) {
        // Por seguridad no decimos si existe o no
        return res.json({ message: 'Si el correo está registrado, se ha enviado un nuevo enlace.' });
      }

      if (user.isVerified) {
        return res.status(400).json({ error: 'La cuenta ya está verificada.' });
      }

      // Generar nuevo token
      const verificationToken = crypto.randomBytes(32).toString('hex');
      user.verificationToken = verificationToken;
      await user.save();

      // Enviar correo de verificación
      const frontendUrl = process.env.NODE_ENV === 'production' ? 'https://waygass.es' : 'http://localhost:5173';
      const verifyUrl = `${frontendUrl}/verify?token=${verificationToken}`;

      const mailOptions = {
        from: process.env.SMTP_USER || 'info@waygass.es',
        to: email,
        subject: 'Verifica tu cuenta en WayGass (Reenvío)',
        html: `
          <div style="font-family: Arial, sans-serif; text-align: center; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #f97316;">¡Hola de nuevo, ${user.name}!</h2>
            <p>Has solicitado un nuevo enlace para verificar tu cuenta en WayGass.</p>
            <a href="${verifyUrl}" style="display: inline-block; margin: 20px 0; padding: 12px 24px; background-color: #f97316; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">Verificar Cuenta</a>
            <p style="font-size: 12px; color: #666;">Si no has solicitado este correo, puedes ignorarlo.</p>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
      res.json({ message: 'Se ha reenviado el correo de verificación.' });
    } catch (error) {
      console.error('Error reenviando email:', error);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  });
app.post('/api/login', async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;
    
    console.log(`[AUTH] Intento de login para email: ${email}`);

    if (!email || !password) {
      console.warn(`[AUTH-ERROR] Login fallido: Campos incompletos.`);
      return res.status(400).json({ error: "Correo y contraseña son obligatorios." });
    }

    // Buscar usuario
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.warn(`[AUTH-ERROR] Login fallido: Usuario no encontrado (${email}).`);
      return res.status(401).json({ error: "El correo o la contraseña son incorrectos." });
    }

    // Validar contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.warn(`[AUTH-ERROR] Login fallido: Contraseña incorrecta para ${email}.`);
      return res.status(401).json({ error: "El correo o la contraseña son incorrectos." });
    }

    if (user.isVerified === false) {
      console.warn(`[AUTH-ERROR] Login fallido: Email no verificado (${email}).`);
      return res.status(403).json({ error: "Por favor, verifica tu correo electrónico antes de iniciar sesión." });
    }

    // Auto-upgrade a ADMIN en login (para entorno de producción si la cuenta ya existía)
    if (email === 'dylanjesussuarez@gmail.com') {
      let updated = false;
      if (user.role !== 'admin') { user.role = 'admin'; updated = true; }
      if (user.subscription !== 'pro') { user.subscription = 'pro'; updated = true; }
      if (updated) {
        await user.save();
        console.log(`[AUTH] Actualizados privilegios a ADMIN/PRO automáticamente para ${email}`);
      }
    }

    console.log(`[AUTH-SUCCESS] Login exitoso:  ()`);

    // Generar JWT
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: rememberMe ? '365d' : '1d' });
    
    res.json({
      token,
      user: { id: user.id, name: user.name, lastName: user.lastName, email: user.email, subscription: user.subscription, role: user.role }
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ error: "Error interno del servidor al iniciar sesión." });
  }
});

// ==========================================
// Endpoints de Usuario (Ajustes, Favoritos y Validación)
// ==========================================

app.get('/api/ranking', async (req, res) => {
  try {
    const [results] = await db.sequelize.query(`
      SELECT u.id, u.name, u.lastName, COUNT(v.id) as score
      FROM users u
      JOIN Validations v ON u.id = v.userId
      GROUP BY u.id
      ORDER BY score DESC
      LIMIT 10
    `);
    res.json(results);
  } catch (e) {
    console.error("Error obteniendo ranking:", e);
    res.status(500).json({ error: "Error obteniendo ranking" });
  }
});

// Obtener recuento de validaciones para todas las gasolineras (bulk)
app.get('/api/validations/all', async (req, res) => {
  try {
    const validations = await Validation.findAll();
    const result = {};
    validations.forEach(v => {
      if (!result[v.stationId]) {
        result[v.stationId] = { PRICE_CORRECT: 0, WRONG_PRICE: 0, CLOSED: 0 };
      }
      if (result[v.stationId][v.type] !== undefined) {
        result[v.stationId][v.type]++;
      }
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo validaciones globales." });
  }
});

// Obtener recuento de validaciones para una gasolinera
app.get('/api/stations/:id/validations', async (req, res) => {
  try {
    const { id } = req.params;
    const validations = await Validation.findAll({ where: { stationId: id.toString() } });
    
    const counts = { PRICE_CORRECT: 0, WRONG_PRICE: 0, CLOSED: 0 };
    validations.forEach(v => {
      if (counts[v.type] !== undefined) counts[v.type]++;
    });
    
    res.json(counts);
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo validaciones." });
  }
});

  // Obtener mis validaciones (Anónima o Logueada)
  app.get('/api/validations/me', async (req, res) => {
    try {
      const ipAddress = req.ip || req.connection.remoteAddress;
      
      let userId = null;
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        try {
          const token = authHeader.split(' ')[1];
          const decoded = jwt.verify(token, JWT_SECRET);
          userId = decoded.id;
        } catch (e) {} 
      }

      const whereClause = userId ? { userId } : { ipAddress };
      const myValidations = await Validation.findAll({ where: whereClause });
      
      res.json(myValidations);
    } catch (error) {
      res.status(500).json({ error: "Error obteniendo mis validaciones." });
    }
  });

// Enviar una validación (Anónima o Logueada)
app.post('/api/stations/:id/validate', async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.body; // 'PRICE_CORRECT', 'WRONG_PRICE', 'CLOSED'
    const ipAddress = req.ip || req.connection.remoteAddress;
    
    // Check if token exists to get userId, but don't require it
    let userId = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        userId = decoded.id;
      } catch (e) {} // Ignorar token inválido aquí, permitimos voto anónimo
    }

    // Regla anti-spam: 1 voto por IP o usuario por gasolinera por día. Para el prototipo, lo simplificamos a 1 voto total.
    const whereClause = userId ? { userId, stationId: id.toString() } : { ipAddress, stationId: id.toString() };
    const existing = await Validation.findOne({ where: whereClause });
    
    if (existing) {
      if (type === 'CANCEL') {
        await existing.destroy();
      } else {
        // Si ya votó, actualizamos su voto
        existing.type = type;
        await existing.save();
      }
    } else if (type !== 'CANCEL') {
      await Validation.create({
        stationId: id.toString(),
        userId,
        ipAddress,
        type
      });
    }
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Error guardando validación." });
  }
});

// Obtener favoritos del usuario
app.get('/api/favorites', verifyToken, async (req, res) => {
  try {
    const favorites = await Favorite.findAll({ where: { userId: req.user.id } });
    const favoriteIds = favorites.map(f => f.stationId);
    res.json(favoriteIds);
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo favoritos." });
  }
});

// Añadir/Quitar favorito
app.post('/api/favorites/toggle', verifyToken, async (req, res) => {
  try {
    const { stationId } = req.body;
    if (!stationId) return res.status(400).json({ error: "stationId requerido" });

    const existing = await Favorite.findOne({ 
      where: { userId: req.user.id, stationId: stationId.toString() } 
    });

    if (existing) {
      await existing.destroy();
      res.json({ action: 'removed', stationId });
    } else {
      await Favorite.create({ userId: req.user.id, stationId: stationId.toString() });
      res.json({ action: 'added', stationId });
    }
  } catch (error) {
    res.status(500).json({ error: "Error modificando favoritos." });
  }
});

// Obtener configuración del usuario logueado
app.get('/api/settings', verifyToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar configuración del usuario logueado
app.put('/api/settings', verifyToken, async (req, res) => {
  try {
    // VULNERABILIDAD CORREGIDA: Solo permitimos actualizar campos específicos (Whitelisting).
    // Si usáramos "...updateData", un hacker podría enviar { "subscription": "pro" } y hacerse premium gratis.
    const { name, lastName } = req.body;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (lastName) updateData.lastName = lastName;
    
    if (Object.keys(updateData).length > 0) {
      await User.update(updateData, {
        where: { id: req.user.id }
      });
    }
    
    const updatedUser = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor Backend corriendo en el puerto ${PORT}.`);
});



