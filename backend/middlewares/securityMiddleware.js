const db = require('../models');
const { SecurityLog, BlockedIP } = db;

// Cache of blocked IPs to avoid DB queries on every request
const blockedIPsCache = new Set();

// Load blocked IPs on startup
const loadBlockedIPs = async () => {
  try {
    const ips = await BlockedIP.findAll();
    ips.forEach(r => blockedIPsCache.add(r.ip));
    console.log(`[Security] Loaded ${blockedIPsCache.size} blocked IPs into cache.`);
  } catch (error) {
    console.error('[Security] Failed to load blocked IPs:', error.message);
  }
};

const securityMiddleware = (req, res, next) => {
  const forwarded = req.headers["x-forwarded-for"];
  const realIp = req.headers["x-real-ip"];
  const ip = (forwarded ? forwarded.split(",")[0] : null) || realIp || req.ip || req.connection?.remoteAddress || "unknown";
  req.clientIP = ip;

  if (blockedIPsCache.has(ip)) {
    SecurityLog.create({ 
      ip, 
      method: req.method, 
      path: req.path, 
      statusCode: 403, 
      userAgent: req.headers['user-agent'] || '', 
      eventType: 'BLOCKED' 
    }).catch(() => {});
    return res.status(403).json({ error: 'Acceso denegado por políticas de seguridad.' });
  }
  
  next();
};

const blockIP = (ip) => blockedIPsCache.add(ip);
const unblockIP = (ip) => blockedIPsCache.delete(ip);

module.exports = {
  securityMiddleware,
  loadBlockedIPs,
  blockIP,
  unblockIP
};
