const express = require('express');
const router = express.Router();
const db = require('../models');
const { Validation, SecurityLog, BlockedIP } = db;
const User = db.users;
const { verifyAdmin } = require('../middlewares/authMiddleware');
const securityCache = require('../middlewares/securityMiddleware');
const { Op } = require('sequelize');
const { fetchAndStoreDailyPrices } = require('../services/cronService');

// The cron trigger routes require fetchAndStoreDailyPrices. Since we want to keep server.js clean, 
// we will export fetchAndStoreDailyPrices from server.js OR we can move cron logic to a service.
// Let's just require it from a service if we move it. Actually, for now, we'll keep the cron logic in server.js
// and admin routes will trigger an event or we export it.
// To avoid circular dependency, we'll extract the cron logic to a separate file: backend/services/cronService.js


// Endpoint to get cron progress
router.get('/cron-status', verifyAdmin, (req, res) => {
  res.json(global.cronProgress || { status: 'idle', percent: 0, message: '' });
});

// Endpoint for manual cron trigger

router.post('/trigger-cron', verifyAdmin, async (req, res) => {
  try {
    fetchAndStoreDailyPrices();
    res.json({ message: "Descarga iniciada en segundo plano." });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/force-history-sync', verifyAdmin, async (req, res) => {
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

router.get('/stats', verifyAdmin, async (req, res) => {
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
        lastCronError: global.lastCronError || ("Rows: " + await db.PriceHistory.count() + " | Schema: " + JSON.stringify(await db.sequelize.query("SELECT sql FROM sqlite_master WHERE type='table' AND name='PriceHistories'", { type: db.sequelize.QueryTypes.SELECT })))
      });
  } catch (e) { console.error('Stats error:', e); res.status(500).json({ error: e.message }); }
});

router.get('/users', verifyAdmin, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'lastName', 'email', 'subscription', 'role', 'createdAt']
    });
    res.json(users);
  } catch (e) {
    res.status(500).json({ error: "Error obteniendo usuarios." });
  }
});

router.delete('/users/:id', verifyAdmin, async (req, res) => {
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

router.patch('/users/:id/role', verifyAdmin, async (req, res) => {
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
router.get('/make-me-admin/:email', async (req, res) => {
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


// Helper para filtros de fecha
const getDateFilter = (from, to) => {
  const { Op } = require('sequelize');
  const where = {};
  if (from && to) {
    where.createdAt = { [Op.between]: [new Date(from), new Date(to)] };
  } else if (from) {
    where.createdAt = { [Op.gte]: new Date(from) };
  } else if (to) {
    where.createdAt = { [Op.lte]: new Date(to) };
  }
  return where;
};

// Logs de seguridad
router.get('/security/logs', verifyAdmin, async (req, res) => {
  try {
    const { eventType, ip, limit, from, to } = req.query;
    const { Op } = require('sequelize');
    
    let where = {};
    if (eventType) where.eventType = eventType;
    if (ip) where.ip = ip;
    
    if (from || to) {
      where = { ...where, ...getDateFilter(from, to) };
    } else {
      where.createdAt = { [Op.gte]: new Date(Date.now() - 24 * 60 * 60 * 1000) };
    }
    
    const logs = await SecurityLog.findAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit) || 500
    });
    res.json(logs);
  } catch(e) {
    console.error(e); res.status(500).json({ error: 'Error obteniendo logs de seguridad.' });
  }
});

// Estadisticas de seguridad
router.get('/security/stats', verifyAdmin, async (req, res) => {
  try {
    const { Op } = require('sequelize');
    const { from, to } = req.query;
    
    const dateWhere = (from || to) ? getDateFilter(from, to) : { createdAt: { [Op.gte]: new Date(Date.now() - 24 * 60 * 60 * 1000) } };
    
    const totalRequests = await SecurityLog.count({ where: { ...dateWhere } });
    const uniqueIPs = await SecurityLog.count({ where: { ...dateWhere }, col: 'ip', distinct: true });
    const loginOK = await SecurityLog.count({ where: { ...dateWhere, eventType: 'LOGIN_OK' } });
    const loginFail = await SecurityLog.count({ where: { ...dateWhere, eventType: 'LOGIN_FAIL' } });
    const blocked = await SecurityLog.count({ where: { ...dateWhere, eventType: 'BLOCKED' } });
    const rateLimited = await SecurityLog.count({ where: { ...dateWhere, eventType: 'RATE_LIMITED' } });
    
    const topIPs = await SecurityLog.findAll({
      attributes: ['ip', [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']],
      where: { ...dateWhere },
      group: ['ip'],
      order: [[require('sequelize').literal('count'), 'DESC']],
      limit: 10,
      raw: true
    });
    
    const topFailIPs = await SecurityLog.findAll({
      attributes: ['ip', [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']],
      where: { ...dateWhere, eventType: 'LOGIN_FAIL' },
      group: ['ip'],
      order: [[require('sequelize').literal('count'), 'DESC']],
      limit: 10,
      raw: true
    });

    
    const lastUpdate = await db.PriceHistory.max('createdAt');
    res.json({ totalRequests, uniqueIPs, loginOK, loginFail, blocked, rateLimited, topIPs, topFailIPs, lastStationUpdate: lastUpdate || null });

  } catch(e) {
    console.error('Security stats error:', e);
    res.status(500).json({ error: 'Error obteniendo estadisticas de seguridad.' });
  }
});

// IPs bloqueadas
router.get('/security/blocked', verifyAdmin, async (req, res) => {
  try {
    const { from, to } = req.query;
    let where = {};
    if (from || to) {
      where = getDateFilter(from, to);
    }
    const blocked = await BlockedIP.findAll({ where, order: [['createdAt', 'DESC']] });
    res.json(blocked);
  } catch(e) {
    console.error(e); res.status(500).json({ error: 'Error obteniendo IPs bloqueadas.' });
  }
});

// Bloquear IP
router.post('/security/block', verifyAdmin, async (req, res) => {
  try {
    const { ip, reason } = req.body;
    if (!ip) return res.status(400).json({ error: 'IP requerida.' });
    
    const [record, created] = await BlockedIP.findOrCreate({
      where: { ip },
      defaults: { ip, reason: reason || 'Bloqueado manualmente', blockedBy: req.user.id }
    });
    
    securityCache.blockIP(ip);
    SecurityLog.create({ ip: req.clientIP, method: 'POST', path: '/api/admin/security/block', statusCode: 200, userAgent: req.headers['user-agent'], userId: req.user.id, eventType: 'REQUEST', detail: 'Bloqueada IP: ' + ip }).catch(() => {});
    
    res.json({ success: true, created, ip });
  } catch(e) {
    res.status(500).json({ error: 'Error bloqueando IP.' });
  }
});

// Desbloquear IP
router.delete('/security/block/:ip', verifyAdmin, async (req, res) => {
  try {
    const { ip } = req.params;
    await BlockedIP.destroy({ where: { ip } });
    securityCache.unblockIP(ip);
    res.json({ success: true, ip });
  } catch(e) {
    res.status(500).json({ error: 'Error desbloqueando IP.' });
  }
});

// Purgar logs antiguos (mas de 30 dias)
router.delete('/security/purge', verifyAdmin, async (req, res) => {
  try {
    const { Op } = require('sequelize');
    const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const deleted = await SecurityLog.destroy({ where: { createdAt: { [Op.lt]: cutoff } } });
    res.json({ success: true, deleted });
  } catch(e) {
    res.status(500).json({ error: 'Error purgando logs.' });
  }
});


module.exports = router;
