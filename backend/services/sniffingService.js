const geoip = require('geoip-lite');
const { Op, fn, col, literal } = require('sequelize');
const db = require('../models');

const COUNTRY_NAMES = {
  ES: 'España',
  US: 'Estados Unidos',
  FR: 'Francia',
  DE: 'Alemania',
  GB: 'Reino Unido',
  IT: 'Italia',
  PT: 'Portugal',
  MX: 'México',
  AR: 'Argentina',
  CO: 'Colombia',
  CL: 'Chile',
  PE: 'Perú',
  NL: 'Países Bajos',
  BE: 'Bélgica',
  CH: 'Suiza',
  AD: 'Andorra',
  MA: 'Marruecos',
  BR: 'Brasil',
  CA: 'Canadá',
  SE: 'Suecia',
  NO: 'Noruega',
  DK: 'Dinamarca',
  IE: 'Irlanda',
  AT: 'Austria',
  PL: 'Polonia',
  RO: 'Rumanía'
};

function cleanClientIP(rawIp) {
  if (!rawIp) return '127.0.0.1';
  let ip = rawIp;
  if (ip.includes(',')) {
    ip = ip.split(',')[0].trim();
  }
  if (ip.startsWith('::ffff:')) {
    ip = ip.replace('::ffff:', '');
  }
  return ip.trim();
}

function parseGeo(rawIp, req) {
  const ip = cleanClientIP(rawIp);

  // Verificación de IP local / privada
  const isLocal = !ip ||
    ip === '127.0.0.1' ||
    ip === '::1' ||
    ip.startsWith('192.168.') ||
    ip.startsWith('10.') ||
    ip.startsWith('172.16.') ||
    ip.startsWith('172.17.') ||
    ip.startsWith('172.18.') ||
    ip.startsWith('172.19.') ||
    ip.startsWith('172.2') ||
    ip.startsWith('172.3');

  if (isLocal) {
    return {
      country: 'Red Local / Dev',
      countryCode: 'ES',
      city: 'Localhost',
      region: 'Desarrollo'
    };
  }

  // Comprobar header de Cloudflare si existe
  const cfCountry = req?.headers ? req.headers['cf-ipcountry'] : null;

  try {
    const geo = geoip.lookup(ip);
    if (geo && geo.country) {
      const code = geo.country.toUpperCase();
      return {
        country: COUNTRY_NAMES[code] || geo.country,
        countryCode: code,
        city: geo.city || '',
        region: geo.region || ''
      };
    }
  } catch (e) {
    console.error('[Sniffing] Error en geoip lookup:', e.message);
  }

  if (cfCountry && cfCountry !== 'XX') {
    const code = cfCountry.toUpperCase();
    return {
      country: COUNTRY_NAMES[code] || cfCountry,
      countryCode: code,
      city: '',
      region: ''
    };
  }

  return {
    country: 'Desconocido',
    countryCode: '',
    city: '',
    region: ''
  };
}

function parseUserAgent(ua) {
  if (!ua) return { browser: 'Desconocido', os: 'Desconocido', device: 'Escritorio' };

  let os = 'Desconocido';
  let device = 'Escritorio';

  // Sistema Operativo y Tipo de Dispositivo
  if (/iPad/i.test(ua)) {
    os = 'iPadOS';
    device = 'Tablet';
  } else if (/iPhone|iPod/i.test(ua)) {
    os = 'iOS';
    device = 'Móvil';
  } else if (/Android/i.test(ua)) {
    os = 'Android';
    device = /Mobile/i.test(ua) ? 'Móvil' : 'Tablet';
  } else if (/Windows NT 10.0/i.test(ua)) {
    os = 'Windows 10/11';
    device = 'Escritorio';
  } else if (/Windows/i.test(ua)) {
    os = 'Windows';
    device = 'Escritorio';
  } else if (/Macintosh|Mac OS X/i.test(ua)) {
    os = 'macOS';
    device = 'Escritorio';
  } else if (/Linux/i.test(ua)) {
    os = 'Linux';
    device = 'Escritorio';
  } else if (/bot|crawler|spider|crawling|googlebot|bingbot/i.test(ua)) {
    os = 'Bot / Crawler';
    device = 'Bot';
  }

  // Navegador
  let browser = 'Desconocido';
  if (/Edg/i.test(ua)) {
    browser = 'Edge';
  } else if (/SamsungBrowser/i.test(ua)) {
    browser = 'Samsung Internet';
  } else if (/OPR|Opera/i.test(ua)) {
    browser = 'Opera';
  } else if (/Chrome|CriOS/i.test(ua)) {
    browser = 'Chrome';
  } else if (/Safari/i.test(ua)) {
    browser = 'Safari';
  } else if (/Firefox|FxiOS/i.test(ua)) {
    browser = 'Firefox';
  } else if (/bot|crawler|spider/i.test(ua)) {
    browser = 'Bot';
  }

  return { browser, os, device };
}

function parseReferrer(rawRef) {
  if (!rawRef || rawRef === '' || rawRef === 'null' || rawRef === 'undefined') {
    return { name: 'Directo / Marcadores', url: '' };
  }

  const clean = rawRef.trim().toLowerCase();

  // Tráfico interno de la propia web
  if (clean.includes('waygass.es') || clean.includes('localhost') || clean.includes('127.0.0.1')) {
    return { name: 'Navegación Interna', url: rawRef };
  }

  if (clean.includes('google.')) return { name: 'Google Search', url: rawRef };
  if (clean.includes('instagram.')) return { name: 'Instagram', url: rawRef };
  if (clean.includes('facebook.') || clean.includes('fb.com')) return { name: 'Facebook', url: rawRef };
  if (clean.includes('twitter.') || clean.includes('t.co') || clean.includes('x.com')) return { name: 'Twitter / X', url: rawRef };
  if (clean.includes('tiktok.')) return { name: 'TikTok', url: rawRef };
  if (clean.includes('bing.')) return { name: 'Bing', url: rawRef };
  if (clean.includes('yahoo.')) return { name: 'Yahoo', url: rawRef };
  if (clean.includes('duckduckgo.')) return { name: 'DuckDuckGo', url: rawRef };
  if (clean.includes('t.me') || clean.includes('telegram.')) return { name: 'Telegram', url: rawRef };
  if (clean.includes('whatsapp.')) return { name: 'WhatsApp', url: rawRef };
  if (clean.includes('reddit.')) return { name: 'Reddit', url: rawRef };
  if (clean.includes('linkedin.')) return { name: 'LinkedIn', url: rawRef };

  // Intentar obtener el nombre de dominio simplificado
  try {
    const urlObj = new URL(rawRef);
    const domain = urlObj.hostname.replace(/^www\./, '');
    return { name: domain, url: rawRef };
  } catch (e) {
    return { name: 'Enlace Externo', url: rawRef };
  }
}

async function recordVisit({ rawIp, path, referrer, userAgent, user, req }) {
  try {
    const ip = cleanClientIP(rawIp);
    const cleanPath = (path || '/').split('?')[0] || '/';

    // Descartar rutas internas irrelevantes o de assets
    if (
      cleanPath.startsWith('/api/') ||
      cleanPath.endsWith('.ico') ||
      cleanPath.endsWith('.png') ||
      cleanPath.endsWith('.jpg') ||
      cleanPath.endsWith('.svg') ||
      cleanPath.endsWith('.json')
    ) {
      return { skipped: true, reason: 'asset' };
    }

    // Segmentación: Noticias (Blog) vs Web Normal
    const category = cleanPath.startsWith('/blog') ? 'blog' : 'app';

    // Deduplicación inteligente: si la misma IP visita la misma ruta en menos de 2 minutos, no duplicar
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
    const existing = await db.VisitLog.findOne({
      where: {
        ip,
        path: cleanPath,
        createdAt: { [Op.gte]: twoMinutesAgo }
      }
    });

    if (existing) {
      return { skipped: true, reason: 'deduplicated' };
    }

    const geo = parseGeo(ip, req);
    const uaInfo = parseUserAgent(userAgent);
    const refInfo = parseReferrer(referrer);

    const visit = await db.VisitLog.create({
      ip,
      path: cleanPath,
      category,
      referrer: refInfo.name,
      referrerUrl: refInfo.url ? refInfo.url.substring(0, 500) : null,
      userAgent: userAgent ? userAgent.substring(0, 500) : null,
      browser: uaInfo.browser,
      os: uaInfo.os,
      device: uaInfo.device,
      country: geo.country,
      countryCode: geo.countryCode,
      city: geo.city,
      region: geo.region,
      userId: user?.id || null,
      userEmail: user?.email || null,
      userName: user ? `${user.name || ''} ${user.lastName || ''}`.trim() : null
    });

    return { success: true, visitId: visit.id };
  } catch (err) {
    console.error('[Sniffing] Error al registrar visita:', err.message);
    return { error: err.message };
  }
}

async function getSniffingStats() {
  try {
    const now = new Date();
    
    // Inicio del día de hoy (00:00:00)
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    // 24 horas atrás
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    // 7 días atrás
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    // 30 días atrás
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // 1. Métricas temporales (Hoy, 7 días, 30 días, Total) con desglose por categoría
    const [
      todayTotal,
      todayApp,
      todayBlog,
      weekTotal,
      weekApp,
      weekBlog,
      monthTotal,
      monthApp,
      monthBlog,
      allTotal,
      allApp,
      allBlog
    ] = await Promise.all([
      db.VisitLog.count({ where: { createdAt: { [Op.gte]: startOfToday } } }),
      db.VisitLog.count({ where: { createdAt: { [Op.gte]: startOfToday }, category: 'app' } }),
      db.VisitLog.count({ where: { createdAt: { [Op.gte]: startOfToday }, category: 'blog' } }),

      db.VisitLog.count({ where: { createdAt: { [Op.gte]: last7Days } } }),
      db.VisitLog.count({ where: { createdAt: { [Op.gte]: last7Days }, category: 'app' } }),
      db.VisitLog.count({ where: { createdAt: { [Op.gte]: last7Days }, category: 'blog' } }),

      db.VisitLog.count({ where: { createdAt: { [Op.gte]: last30Days } } }),
      db.VisitLog.count({ where: { createdAt: { [Op.gte]: last30Days }, category: 'app' } }),
      db.VisitLog.count({ where: { createdAt: { [Op.gte]: last30Days }, category: 'blog' } }),

      db.VisitLog.count(),
      db.VisitLog.count({ where: { category: 'app' } }),
      db.VisitLog.count({ where: { category: 'blog' } })
    ]);

    // 2. Tendencia de los últimos 7 días (día por día)
    const dailyTrend = [];
    for (let i = 6; i >= 0; i--) {
      const dStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i, 0, 0, 0);
      const dEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i, 23, 59, 59, 999);
      
      const [dayTotal, dayApp, dayBlog] = await Promise.all([
        db.VisitLog.count({ where: { createdAt: { [Op.between]: [dStart, dEnd] } } }),
        db.VisitLog.count({ where: { createdAt: { [Op.between]: [dStart, dEnd] }, category: 'app' } }),
        db.VisitLog.count({ where: { createdAt: { [Op.between]: [dStart, dEnd] }, category: 'blog' } })
      ]);

      const label = dStart.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' });
      dailyTrend.push({
        date: label,
        total: dayTotal,
        app: dayApp,
        blog: dayBlog
      });
    }

    // 3. De dónde nos visitan (Top Países y Ciudades)
    const topCountriesRaw = await db.VisitLog.findAll({
      attributes: ['country', 'countryCode', [fn('COUNT', col('id')), 'count']],
      where: { country: { [Op.ne]: 'Desconocido' } },
      group: ['country', 'countryCode'],
      order: [[literal('count'), 'DESC']],
      limit: 8,
      raw: true
    });

    const topCountries = topCountriesRaw.map(c => ({
      country: c.country,
      countryCode: c.countryCode,
      count: parseInt(c.count, 10),
      percentage: allTotal > 0 ? Math.round((parseInt(c.count, 10) / allTotal) * 100) : 0
    }));

    const topCitiesRaw = await db.VisitLog.findAll({
      attributes: ['city', 'country', [fn('COUNT', col('id')), 'count']],
      where: { city: { [Op.ne]: '' } },
      group: ['city', 'country'],
      order: [[literal('count'), 'DESC']],
      limit: 6,
      raw: true
    });

    const topCities = topCitiesRaw.map(c => ({
      city: c.city,
      country: c.country,
      count: parseInt(c.count, 10)
    }));

    // 4. De dónde venían (Top Referrers / Fuentes de Tráfico)
    const topReferrersRaw = await db.VisitLog.findAll({
      attributes: ['referrer', [fn('COUNT', col('id')), 'count']],
      group: ['referrer'],
      order: [[literal('count'), 'DESC']],
      limit: 8,
      raw: true
    });

    const topReferrers = topReferrersRaw.map(r => ({
      name: r.referrer,
      count: parseInt(r.count, 10),
      percentage: allTotal > 0 ? Math.round((parseInt(r.count, 10) / allTotal) * 100) : 0
    }));

    // 5. Quién nos visita (Dispositivos, Sistemas Operativos, Navegadores)
    const [devicesRaw, osRaw, browsersRaw, authCount, anonCount] = await Promise.all([
      db.VisitLog.findAll({
        attributes: ['device', [fn('COUNT', col('id')), 'count']],
        group: ['device'],
        order: [[literal('count'), 'DESC']],
        raw: true
      }),
      db.VisitLog.findAll({
        attributes: ['os', [fn('COUNT', col('id')), 'count']],
        group: ['os'],
        order: [[literal('count'), 'DESC']],
        limit: 5,
        raw: true
      }),
      db.VisitLog.findAll({
        attributes: ['browser', [fn('COUNT', col('id')), 'count']],
        group: ['browser'],
        order: [[literal('count'), 'DESC']],
        limit: 5,
        raw: true
      }),
      db.VisitLog.count({ where: { userId: { [Op.ne]: null } } }),
      db.VisitLog.count({ where: { userId: null } })
    ]);

    const devices = {
      mobile: 0,
      desktop: 0,
      tablet: 0
    };
    devicesRaw.forEach(d => {
      const dev = (d.device || '').toLowerCase();
      const cnt = parseInt(d.count, 10);
      if (dev.includes('móvil') || dev.includes('movil')) devices.mobile += cnt;
      else if (dev.includes('tablet')) devices.tablet += cnt;
      else devices.desktop += cnt;
    });

    // 6. Registro de visitas recientes (Últimas 100)
    const recentVisitsRaw = await db.VisitLog.findAll({
      order: [['createdAt', 'DESC']],
      limit: 100,
      raw: true
    });

    const recentVisits = recentVisitsRaw.map(v => {
      let isoDate = v.createdAt;
      if (v.createdAt) {
        try {
          const d = new Date(v.createdAt);
          if (!isNaN(d.getTime())) {
            isoDate = d.toISOString();
          } else {
            const parts = String(v.createdAt).trim().split(' ');
            if (parts.length >= 2) {
              isoDate = parts[0] + 'T' + parts[1] + (parts[2] ? parts[2] : 'Z');
            }
          }
        } catch (e) {
          isoDate = v.createdAt;
        }
      }
      return {
        ...v,
        createdAt: isoDate
      };
    });

    return {
      overview: {
        today: { total: todayTotal, app: todayApp, blog: todayBlog },
        week: { total: weekTotal, app: weekApp, blog: weekBlog },
        month: { total: monthTotal, app: monthApp, blog: monthBlog },
        allTime: { total: allTotal, app: allApp, blog: allBlog }
      },
      dailyTrend,
      topCountries,
      topCities,
      topReferrers,
      tech: {
        devices,
        operatingSystems: osRaw.map(o => ({ name: o.os, count: parseInt(o.count, 10) })),
        browsers: browsersRaw.map(b => ({ name: b.browser, count: parseInt(b.count, 10) })),
        users: { authenticated: authCount, anonymous: anonCount }
      },
      recentVisits
    };
  } catch (err) {
    console.error('[Sniffing] Error al obtener estadísticas:', err);
    throw err;
  }
}

module.exports = {
  recordVisit,
  getSniffingStats,
  parseGeo,
  parseUserAgent,
  parseReferrer
};
