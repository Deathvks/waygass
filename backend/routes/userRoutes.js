const express = require('express');
const router = express.Router();
const db = require('../models');
const { Favorite, Validation } = db;
const User = db.users;
const { verifyToken } = require('../middlewares/authMiddleware');


router.get('/ranking', async (req, res) => {
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
router.get('/validations/all', async (req, res) => {
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
router.get('/stations/:id/validations', async (req, res) => {
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
  router.get('/validations/me', async (req, res) => {
    try {
      const ipAddress = req.clientIP;
      
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
router.post('/stations/:id/validate', async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.body; // 'PRICE_CORRECT', 'WRONG_PRICE', 'CLOSED'
    const ipAddress = req.clientIP;
    
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
router.get('/favorites', verifyToken, async (req, res) => {
    try {
      const uid = parseInt(req.user.id, 10);
      const favorites = await Favorite.findAll({ where: { userId: uid } });
    const favoriteIds = favorites.map(f => f.stationId);
    res.json(favoriteIds);
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo favoritos." });
  }
});

// Añadir/Quitar favorito
router.post('/favorites/toggle', verifyToken, async (req, res) => {
  try {
    const { stationId } = req.body;
    if (!stationId) return res.status(400).json({ error: "stationId requerido" });

    const uid = parseInt(req.user.id, 10);
      const sid = stationId.toString().trim();
      const sidInt = parseInt(sid, 10);

      // Attempt to delete both string and int versions to bypass SQLite dynamic typing bugs
      let deleted = await Favorite.destroy({ where: { userId: uid, stationId: sid } });
      if (!isNaN(sidInt)) {
        deleted += await Favorite.destroy({ where: { userId: uid, stationId: sidInt } });
      }

      if (deleted > 0) {
        res.json({ action: 'removed', stationId: sid });
      } else {
        try {
          await Favorite.create({ userId: uid, stationId: sid });
          res.json({ action: 'added', stationId: sid });
        } catch (err) {
          if (err.name === 'SequelizeUniqueConstraintError') {
            return res.json({ action: 'added', stationId: sid });
          }
          throw err;
        }
      }
  } catch (error) {
    console.error("Error BD Favoritos:", error);
    let detail = error.message;
    if (error.errors && error.errors.length > 0) detail = error.errors.map(e => e.message).join(", ");
    res.status(500).json({ error: "BD Error: " + detail });
  }
});

// Obtener configuración del usuario logueado
router.get('/settings', verifyToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, { attributes: { exclude: ['password'] } });
    if (user && user.email !== req.user.email) return res.status(401).json({ error: 'Token inválido por cambio de DB' });
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar configuración del usuario logueado
router.put('/settings', verifyToken, async (req, res) => {
  try {
    // VULNERABILIDAD CORREGIDA: Solo permitimos actualizar campos específicos (Whitelisting).
    // Si usáramos "...updateData", un hacker podría enviar { "subscription": "pro" } y hacerse premium gratis.
    const { name, lastName, garage, activeGarageId, vehicleName, theme, tankSize, gpsApp, cardWaylet, cardCepsa } = req.body;
      
      const updateData = {};
      if (name !== undefined) updateData.name = name;
      if (lastName !== undefined) updateData.lastName = lastName;
      if (garage !== undefined) updateData.garage = garage;
      if (activeGarageId !== undefined) updateData.activeGarageId = activeGarageId;
      if (vehicleName !== undefined) updateData.vehicleName = vehicleName;
      if (theme !== undefined) updateData.theme = theme;
      if (tankSize !== undefined) updateData.tankSize = tankSize;
      if (gpsApp !== undefined) updateData.gpsApp = gpsApp;
      if (cardWaylet !== undefined) updateData.cardWaylet = cardWaylet;
      if (cardCepsa !== undefined) updateData.cardCepsa = cardCepsa;
    
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

module.exports = router;
