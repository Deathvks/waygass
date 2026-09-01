const db = require('../models');
const { SecurityLog, BlockedIP } = db;
const { sendTelegramAlert } = require('../services/alertService');

// Cach\u00e9 de IPs bloqueadas
const blockedIPsCache = new Set();

// Tracker de peticiones para Rate Limiting en memoria
// Estructura: { "ip": { count: number, resetAt: number } }
const rateLimitTracker = new Map();

// Configuraci\u00f3n de Rate Limit (ej. max 150 peticiones por minuto)
const RATE_LIMIT_MAX = 150;
const RATE_LIMIT_WINDOW_MS = 60000;

// Patrones t\u00edpicos de escaneo de vulnerabilidades
const BAD_PATTERNS = [
  /\.php$/i,
  /wp-admin/i,
  /wp-login/i,
  /\.env$/i,
  /\.git/i,
  /\/etc\/passwd/i,
  /phpmyadmin/i,
  /\/actuator/i
];

const loadBlockedIPs = async () => {
  try {
    const ips = await BlockedIP.findAll();
    ips.forEach(r => blockedIPsCache.add(r.ip));
    console.log(`[Security] Loaded ${blockedIPsCache.size} blocked IPs into cache.`);
  } catch (error) {
    console.error('[Security] Failed to load blocked IPs:', error.message);
  }
};

const autoBlockIp = async (ip, reason, req) => {
  if (blockedIPsCache.has(ip)) return;
  
  blockedIPsCache.add(ip);
  
  try {
    await BlockedIP.findOrCreate({
      where: { ip },
      defaults: { ip, reason, blockedBy: 0 } // 0 = Sistema autom\u00e1tico
    });

    await SecurityLog.create({ 
      ip, 
      method: req.method, 
      path: req.path, 
      statusCode: 403, 
      userAgent: req.headers['user-agent'] || '', 
      eventType: 'AUTO_BLOCKED',
      detail: reason
    });

    // Alertar por Telegram
    const alertMessage = `\uD83D\uDEA8 <b>ALERTA DE SEGURIDAD</b> \uD83D\uDEA8\n\n<b>IP:</b> <code>${ip}</code>\n<b>Ruta:</b> ${req.method} ${req.path}\n<b>Motivo:</b> ${reason}\n\n\uD83D\uDEE1\uFE0F <i>La IP ha sido bloqueada permanentemente.</i>`;
    await sendTelegramAlert(alertMessage);
    console.log(`[Security] IP ${ip} auto-bloqueada. Motivo: ${reason}`);
  } catch(e) {
    console.error('[Security] Error en autoBlockIp:', e.message);
  }
};

const securityMiddleware = async (req, res, next) => {
  const forwarded = req.headers["x-forwarded-for"];
  const realIp = req.headers["x-real-ip"];
  const ip = (forwarded ? forwarded.split(",")[0] : null) || realIp || req.ip || req.connection?.remoteAddress || "unknown";
  req.clientIP = ip;

  // 1. Rechazar IPs bloqueadas inmediatamente
  if (blockedIPsCache.has(ip)) {
    SecurityLog.create({ 
      ip, 
      method: req.method, 
      path: req.path, 
      statusCode: 403, 
      userAgent: req.headers['user-agent'] || '', 
      eventType: 'BLOCKED' 
    }).catch(() => {});
    return res.status(403).json({ error: 'Acceso denegado por pol\u00edticas de seguridad.' });
  }
  
  const now = Date.now();

  // 2. Esc\u00e1ner de Rutas Maliciosas
  for (const pattern of BAD_PATTERNS) {
    if (pattern.test(req.path)) {
      await autoBlockIp(ip, `Escaneo de vulnerabilidad detectado: ${req.path}`, req);
      return res.status(403).json({ error: 'Acceso denegado por pol\u00edticas de seguridad.' });
    }
  }

  // 3. Rate Limiting Agresivo
  if (!rateLimitTracker.has(ip)) {
    rateLimitTracker.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
  } else {
    const tracker = rateLimitTracker.get(ip);
    if (now > tracker.resetAt) {
      // Expir\u00f3 la ventana, resetear
      tracker.count = 1;
      tracker.resetAt = now + RATE_LIMIT_WINDOW_MS;
    } else {
      tracker.count++;
      if (tracker.count > RATE_LIMIT_MAX) {
        // Bloquear
        await autoBlockIp(ip, `Ataque DDoS / Spam detectado: m\u00e1s de ${RATE_LIMIT_MAX} reqs por minuto`, req);
        return res.status(429).json({ error: 'Demasiadas peticiones. Acceso denegado.' });
      }
    }
  }
  
  next();
};

// Limpieza peri\u00f3dica del mapa de rate limiting para evitar memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [ip, tracker] of rateLimitTracker.entries()) {
    if (now > tracker.resetAt) {
      rateLimitTracker.delete(ip);
    }
  }
}, 60000);

const blockIP = (ip) => blockedIPsCache.add(ip);
const unblockIP = (ip) => blockedIPsCache.delete(ip);

module.exports = {
  securityMiddleware,
  loadBlockedIPs,
  blockIP,
  unblockIP
};
