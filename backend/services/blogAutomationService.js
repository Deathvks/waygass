const fs = require('fs');
const path = require('path');
const { Op } = require('sequelize');
const db = require('../models');

// Catálogo curado de imágenes automotrices de alta resolución (16:9) libres de derechos en Unsplash
const AUTOMOTIVE_IMAGE_POOLS = {
  gasolinera: [
    {
      url: 'https://images.unsplash.com/photo-1545459720-aac8509eb02c?auto=format&fit=crop&w=1200&h=675&q=80',
      alt: 'Surtidor de gasolina y manguera de repostaje en estación de servicio',
      caption: 'Foto: Archivo WayGass / Pista de repostaje en estación de servicio.'
    },
    {
      url: 'https://images.unsplash.com/photo-1527018607619-a508a2be00bf?auto=format&fit=crop&w=1200&h=675&q=80',
      alt: 'Estación de servicio iluminada de noche con precios de combustible',
      caption: 'Foto: Archivo WayGass / Estación de servicio y tótem de precios.'
    },
    {
      url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&h=675&q=80',
      alt: 'Detalle de boquerel introducido en la boca de llenado del vehículo',
      caption: 'Foto: Archivo WayGass / Suministro de combustible en surtidor.'
    },
    {
      url: 'https://images.unsplash.com/photo-1616422285623-13ff0162193c?auto=format&fit=crop&w=1200&h=675&q=80',
      alt: 'Gasolinera con surtidores automáticos y marquesina',
      caption: 'Foto: Archivo WayGass / Surtidores automáticos en carretera.'
    }
  ],
  mecanica: [
    {
      url: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=1200&h=675&q=80',
      alt: 'Motor de coche abierto y componentes mecánicos en taller',
      caption: 'Foto: Archivo WayGass / Mecánica del vano motor en revisión.'
    },
    {
      url: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1200&h=675&q=80',
      alt: 'Mecánico comprobando niveles de líquidos y filtros del motor',
      caption: 'Foto: Archivo WayGass / Mantenimiento preventivo en taller profesional.'
    },
    {
      url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&h=675&q=80',
      alt: 'Coche elevado en taller para inspección de bajos y escape',
      caption: 'Foto: Archivo WayGass / Revisión de sistema de escape y transmisión.'
    },
    {
      url: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=1200&h=675&q=80',
      alt: 'Herramientas de diagnosis electrónica conectadas a centralita de coche',
      caption: 'Foto: Archivo WayGass / Diagnosis del sistema de inyección.'
    }
  ],
  ahorro: [
    {
      url: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1200&h=675&q=80',
      alt: 'Conductor al volante en autovía a velocidad constante',
      caption: 'Foto: Archivo WayGass / Conducción eficiente en autovía.'
    },
    {
      url: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&h=675&q=80',
      alt: 'Coche circulando al atardecer por autopista despejada',
      caption: 'Foto: Archivo WayGass / Viaje por carretera a régimen constante.'
    },
    {
      url: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&h=675&q=80',
      alt: 'Cuadro de instrumentos digital de vehículo moderno con datos de consumo',
      caption: 'Foto: Archivo WayGass / Panel de instrumentos y ordenador de a bordo.'
    },
    {
      url: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&h=675&q=80',
      alt: 'Vehículo circulando en carretera secundaria con curvas suaves',
      caption: 'Foto: Archivo WayGass / Trazado interurbano y gestión de inercia.'
    }
  ],
  neumaticos: [
    {
      url: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&w=1200&h=675&q=80',
      alt: 'Detalle de rueda de coche y dibujo de neumático sobre el asfalto',
      caption: 'Foto: Archivo WayGass / Banda de rodadura y comprobación de presión.'
    },
    {
      url: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&h=675&q=80',
      alt: 'Comprobación de presión de neumáticos con manómetro en gasolinera',
      caption: 'Foto: Archivo WayGass / Ajuste de bares en estación de servicio.'
    }
  ],
  dgt: [
    {
      url: 'https://images.unsplash.com/photo-1471478331149-c72f17e33c73?auto=format&fit=crop&w=1200&h=675&q=80',
      alt: 'Carretera con señalización vial de velocidad y marcas viales',
      caption: 'Foto: Archivo WayGass / Señalización de velocidad en red de carreteras.'
    },
    {
      url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&h=675&q=80',
      alt: 'Vehículo en viaje de largo recorrido por autovía',
      caption: 'Foto: Archivo WayGass / Operación salida en vías de alta capacidad.'
    },
    {
      url: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=1200&h=675&q=80',
      alt: 'Túnel de autovía iluminado con control de velocidad',
      caption: 'Foto: Archivo WayGass / Tramos de velocidad controlada en túneles.'
    }
  ],
  clima: [
    {
      url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&h=675&q=80',
      alt: 'Gotas de lluvia sobre el parabrisas y tráfico en carretera',
      caption: 'Foto: Archivo WayGass / Conducción en condiciones climáticas adversas.'
    },
    {
      url: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&h=675&q=80',
      alt: 'Detalle del salpicadero y rejillas de ventilación del climatizador',
      caption: 'Foto: Archivo WayGass / Salidas de climatización y confort térmico.'
    }
  ]
};

// Banco de temas de alto impacto SEO e interés masivo en España (Long-Tail y Noticias de Retención)
const HIGH_RETENTION_TOPIC_IDEAS = [
  {
    topic: 'Apurar la reserva de combustible: cuántos kilómetros reales quedan y qué piezas del motor se averían',
    category: 'Mecánica',
    imageKey: 'mecanica',
    kicker: 'MECÁNICA PREVENTIVA'
  },
  {
    topic: 'El botón del salpicadero que ahorra hasta un 15% de combustible y la mayoría de conductores usa al revés',
    category: 'Ahorro Inteligente',
    imageKey: 'ahorro',
    kicker: 'TRUCOS DE CONDUCCIÓN'
  },
  {
    topic: 'Multas de la DGT por llevar bultos en el asiento trasero o exceso de peso en el maletero',
    category: 'Guía Práctica',
    imageKey: 'dgt',
    kicker: 'NORMATIVA DE TRÁFICO'
  },
  {
    topic: 'Por qué los motores diésel se estropean si solo hacen ciudad: cómo salvar el filtro DPF y la válvula EGR',
    category: 'Mantenimiento',
    imageKey: 'mecanica',
    kicker: 'SALUD DEL MOTOR'
  },
  {
    topic: 'La prueba de la probeta en las gasolineras: cómo comprobar si el surtidor te está cobrando más litros de los reales',
    category: 'Tecnología',
    imageKey: 'gasolinera',
    kicker: 'DERECHOS DEL CONSUMIDOR'
  },
  {
    topic: 'Qué le pasa a tu coche si repostas gasolina en un diésel: el error de 3.000 euros si giras la llave',
    category: 'Mecánica',
    imageKey: 'gasolinera',
    kicker: 'EMERGENCIAS AL VOLANTE'
  },
  {
    topic: 'Presión de neumáticos con lluvia y frío: por qué 0,3 bares marcan la diferencia entre frenar a tiempo o hacer aquaplaning',
    category: 'Mantenimiento',
    imageKey: 'neumaticos',
    kicker: 'SEGURIDAD VIAL'
  },
  {
    topic: 'Cómo pasar la prueba de gases de la ITV a la primera: trucos legales para limpiar el escape antes de la cita',
    category: 'Guía Práctica',
    imageKey: 'mecanica',
    kicker: 'INSPECCIÓN TÉCNICA'
  },
  {
    topic: 'Aditivos limpiadores de inyectores y antifricción: cuáles funcionan según la ciencia y cuáles son una estafa',
    category: 'Mantenimiento',
    imageKey: 'mecanica',
    kicker: 'ANÁLISIS QUÍMICO'
  },
  {
    topic: 'Gasolineras automáticas low-cost: el veredicto definitivo de laboratorios sobre la pureza del combustible',
    category: 'Ahorro Inteligente',
    imageKey: 'gasolinera',
    kicker: 'INVESTIGACIÓN WAYGASS'
  },
  {
    topic: 'Luces de emergencia V-16 conectadas obligatorias: cuándo multará la DGT y cómo elegir una homologada',
    category: 'Tecnología',
    imageKey: 'dgt',
    kicker: 'NORMATIVA DGT'
  },
  {
    topic: 'Coche híbrido vs diésel vs gasolina en 2026: calculadora exacta de kilómetros para amortizar la compra',
    category: 'Movilidad Ecológica',
    imageKey: 'ahorro',
    kicker: 'COMPARATIVA ECONÓMICA'
  },
  {
    topic: '¿Cuánto tiempo puede estar la gasolina en el depósito sin caducar ni estropear los conductos del coche?',
    category: 'Mantenimiento',
    imageKey: 'gasolinera',
    kicker: 'QUÍMICA DEL COMBUSTIBLE'
  },
  {
    topic: 'Conducir con abrigo grueso, chanclas o descalzo: qué dice la ley de tráfico y las multas reales de la Guardia Civil',
    category: 'Guía Práctica',
    imageKey: 'dgt',
    kicker: 'CÓDIGO DE CIRCULACIÓN'
  },
  {
    topic: 'Batería descargada en mañanas frías: cómo arrancarlo con pinzas sin reventar la centralita electrónica del coche',
    category: 'Mecánica',
    imageKey: 'mecanica',
    kicker: 'MECÁNICA BÁSICA'
  },
  {
    topic: 'Los radares de tramo y en cascada en las autovías españolas: cómo calculan la velocidad media y dónde se ubican',
    category: 'Tecnología',
    imageKey: 'dgt',
    kicker: 'TECNOLOGÍA VIAL'
  },
  {
    topic: 'Aceite de motor 0W-20 frente a 5W-30: por qué usar una densidad no homologada dispara el consumo y el desgaste',
    category: 'Mantenimiento',
    imageKey: 'mecanica',
    kicker: 'LUBRICACIÓN Y MOTOR'
  },
  {
    topic: 'Etiqueta ambiental DGT y restricciones en Zonas de Bajas Emisiones: multas y excepciones para residentes',
    category: 'Movilidad Ecológica',
    imageKey: 'dgt',
    kicker: 'REGULACIÓN URBANA'
  },
  {
    topic: 'El truco del aire acondicionado y las ventanillas a más de 80 km/h: la prueba en túnel de viento',
    category: 'Ahorro Inteligente',
    imageKey: 'clima',
    kicker: 'AERODINÁMICA Y GASTO'
  },
  {
    topic: 'Por qué el combustible baja de precio a ciertas horas: la estrategia de las distribuidoras para captar clientes',
    category: 'Ahorro Inteligente',
    imageKey: 'gasolinera',
    kicker: 'MERCADO DE CARBURANTES'
  }
];

class BlogAutomationService {
  constructor() {
    this.isGenerating = false;
    this.logs = [];
    this.primaryModel = 'gemini-3.6-flash';
    this.fallbackModels = ['gemini-3.5-flash-lite', 'gemini-2.5-flash'];
  }

  addLog(msg, type = 'info') {
    const timestamp = new Date().toISOString();
    const entry = { timestamp, message: msg, type };
    this.logs.unshift(entry);
    if (this.logs.length > 80) this.logs.pop();
    const symbol = type === 'error' ? '❌' : type === 'success' ? '✅' : type === 'warn' ? '⚠️' : 'ℹ️';
    console.log(`[BlogAutomation] ${symbol} ${msg}`);
  }

  getLogs() {
    return this.logs;
  }

  getApiKey() {
    return process.env.GEMINI_API_KEY || '';
  }

  // Selección inteligente de imagen
  pickImage(imageKey) {
    const pool = AUTOMOTIVE_IMAGE_POOLS[imageKey] || AUTOMOTIVE_IMAGE_POOLS.gasolinera;
    const randomIdx = Math.floor(Math.random() * pool.length);
    return pool[randomIdx];
  }

  // Genera fecha formateada en español
  formatSpanishDate(date = new Date()) {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sept', 'Oct', 'Nov', 'Dic'];
    const d = date.getDate();
    const m = months[date.getMonth()];
    const y = date.getFullYear();
    return `${d} ${m}, ${y}`;
  }

  // Llamada a la API de Gemini con fallback en cascada
  async callGeminiWithFallback(prompt, systemInstruction = null) {
    const apiKey = this.getApiKey();
    const modelsToTry = [this.primaryModel, ...this.fallbackModels];

    for (const model of modelsToTry) {
      try {
        this.addLog(`Consultando modelo ${model}...`, 'info');
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        const payload = {
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }]
            }
          ],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.7,
            maxOutputTokens: 8192
          }
        };

        if (systemInstruction) {
          payload.systemInstruction = {
            parts: [{ text: systemInstruction }]
          };
        }

        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          const errText = await res.text();
          throw new Error(`HTTP ${res.status}: ${errText.substring(0, 150)}`);
        }

        const data = await res.json();
        const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!candidateText) {
          throw new Error('Respuesta de Gemini sin contenido en candidates');
        }

        this.addLog(`Respuesta generada con éxito por ${model}`, 'success');
        return JSON.parse(candidateText);
      } catch (err) {
        this.addLog(`Fallo con ${model}: ${err.message}. Intentando siguiente modelo...`, 'warn');
      }
    }

    throw new Error('Todos los modelos de Gemini fallaron en generar el artículo.');
  }

  // Comprueba si ya se ha publicado un artículo hoy
  async hasArticleForToday() {
    try {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const count = await db.BlogPost.count({
        where: {
          createdAt: {
            [Op.gte]: todayStart
          }
        }
      });
      return count > 0;
    } catch (e) {
      return false;
    }
  }

  // Obtener lista de slugs existentes para evitar duplicados
  async getExistingSlugs() {
    try {
      const posts = await db.BlogPost.findAll({ attributes: ['slug'] });
      return posts.map(p => p.slug);
    } catch (e) {
      return [];
    }
  }

  // Notificación opcional por Telegram si está configurado en .env
  async notifyTelegram(article) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (!token || !chatId) return;

    try {
      const text = `📰 <b>Nueva Noticia Editorial WayGass</b>\n\n` +
        `<b>${article.title}</b>\n\n` +
        `🏷️ Categoría: ${article.category}\n` +
        `⏱️ ${article.readTime}\n` +
        `🔗 https://waygass.es/blog/${article.slug}\n\n` +
        `<i>Generado con ${this.primaryModel}</i>`;

      const tgUrl = `https://api.telegram.org/bot${token.replace(/"/g, '')}/sendMessage`;
      await fetch(tgUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId.replace(/"/g, ''),
          text,
          parse_mode: 'HTML'
        })
      });
      this.addLog('Notificación enviada a Telegram con éxito.', 'success');
    } catch (e) {
      this.addLog(`Error al notificar a Telegram: ${e.message}`, 'warn');
    }
  }

  // Sincroniza el archivo aiArticles.js en frontend/src/data
  async syncAiArticlesFile() {
    try {
      const allAiPosts = await db.BlogPost.findAll({
        where: { status: 'published' },
        order: [['createdAt', 'DESC']]
      });

      const formatted = allAiPosts.map(p => p.toArticleJSON());

      const targetPath = path.resolve(__dirname, '../../frontend/src/data/aiArticles.js');
      const content = `// ==============================================================================\n` +
        `// WAYGASS EDITORIAL - ARTÍCULOS AUTOMATIZADOS CON IA (GEMINI 3.6 FLASH)\n` +
        `// Actualizado automáticamente el ${new Date().toISOString()}\n` +
        `// ==============================================================================\n\n` +
        `export const AI_ARTICLES = ${JSON.stringify(formatted, null, 2)};\n`;

      fs.writeFileSync(targetPath, content, 'utf8');
      this.addLog(`Archivo frontend/src/data/aiArticles.js sincronizado con ${formatted.length} artículos.`, 'success');
    } catch (err) {
      this.addLog(`Error al sincronizar aiArticles.js: ${err.message}`, 'warn');
    }
  }

  // Pre-renderiza estáticamente el nuevo artículo en dist/ si dist existe
  async prerenderArticleInDist(article) {
    try {
      const distDir = path.resolve(__dirname, '../../frontend/dist');
      const templatePath = path.join(distDir, 'index.html');
      if (!fs.existsSync(templatePath)) {
        this.addLog('dist/index.html no encontrado (dist no compilado aún). Saltando inyección estática.', 'info');
        return;
      }

      const template = fs.readFileSync(templatePath, 'utf8');
      const articleDir = path.join(distDir, 'blog', article.slug);
      if (!fs.existsSync(articleDir)) {
        fs.mkdirSync(articleDir, { recursive: true });
      }

      const canonical = `https://waygass.es/blog/${article.slug}`;
      let html = template;

      html = html.replace(/<script id="schema-homepage"[\s\S]*?<\/script>\s*/i, '');
      html = html.replace(/<title>[^<]*<\/title>/i, `<title>${article.title} | WayGass</title>`);
      html = html.replace(/<meta name="description" content="[^"]*"/i, `<meta name="description" content="${article.excerpt}"`);
      html = html.replace(/<link rel="canonical" href="[^"]*"/i, `<link rel="canonical" href="${canonical}"`);

      // Open Graph & Twitter
      html = html.replace(/<meta property="og:title" content="[^"]*"/i, `<meta property="og:title" content="${article.title} | WayGass"`);
      html = html.replace(/<meta property="og:description" content="[^"]*"/i, `<meta property="og:description" content="${article.excerpt}"`);
      html = html.replace(/<meta property="og:url" content="[^"]*"/i, `<meta property="og:url" content="${canonical}"`);
      html = html.replace(/<meta property="og:image" content="[^"]*"/i, `<meta property="og:image" content="${article.image}"`);
      html = html.replace(/<meta property="og:type" content="[^"]*"/i, `<meta property="og:type" content="article"`);

      // Schema NewsArticle
      const jsonLd = {
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        "headline": article.title,
        "description": article.excerpt,
        "image": [article.image],
        "datePublished": article.dateISO,
        "dateModified": article.dateISO,
        "author": [{
          "@type": "Organization",
          "name": article.author?.name || "Redacción WayGass",
          "url": "https://waygass.es/blog"
        }],
        "publisher": {
          "@type": "Organization",
          "name": "WayGass",
          "logo": {
            "@type": "ImageObject",
            "url": "https://waygass.es/logo.png"
          }
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": canonical
        }
      };

      const schemaTag = `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script></head>`;
      html = html.replace('</head>', schemaTag);

      // Noscript crawlable content
      const articleNoscript = `<noscript>
        <div style="padding: 2rem; max-width: 800px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <h1>${article.title}</h1>
          <p><strong>${article.lead || ''}</strong></p>
          <p>${article.excerpt}</p>
          <h2>En 30 segundos: Puntos clave</h2>
          <ul>
            ${(article.keyPoints || []).map(k => `<li>${k}</li>`).join('\n          ')}
          </ul>
          ${(article.sections || []).map(s => `<h2>${s.heading}</h2>\n${(s.paragraphs || []).map(pr => `<p>${pr}</p>`).join('\n')}`).join('\n\n        ')}
          <p><a href="/blog">&larr; Volver al blog</a> | <a href="/">Ver precios de gasolineras en el mapa</a></p>
        </div>
      </noscript>`;

      html = html.replace(/<noscript>[\s\S]*?<\/noscript>/i, articleNoscript);

      fs.writeFileSync(path.join(articleDir, 'index.html'), html, 'utf8');
      this.addLog(`Pre-render HTML creado en dist/blog/${article.slug}/index.html`, 'success');

      // Actualizar sitemap.xml en dist si existe
      const sitemapPath = path.join(distDir, 'sitemap.xml');
      if (fs.existsSync(sitemapPath)) {
        let sm = fs.readFileSync(sitemapPath, 'utf8');
        if (!sm.includes(canonical)) {
          const newEntry = `  <url>\n    <loc>${canonical}</loc>\n    <lastmod>${article.dateISO.split('T')[0]}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>\n</urlset>`;
          sm = sm.replace('</urlset>', newEntry);
          fs.writeFileSync(sitemapPath, sm, 'utf8');
          this.addLog('sitemap.xml actualizado en dist.', 'success');
        }
      }

      // Actualizar rss.xml en dist si existe
      const rssPath = path.join(distDir, 'rss.xml');
      if (fs.existsSync(rssPath)) {
        let rss = fs.readFileSync(rssPath, 'utf8');
        if (!rss.includes(canonical)) {
          const pubDate = new Date(article.dateISO).toUTCString();
          const newItem = `    <item>\n      <title>${article.title.replace(/&/g, '&amp;')}</title>\n      <link>${canonical}</link>\n      <guid isPermaLink="true">${canonical}</guid>\n      <pubDate>${pubDate}</pubDate>\n      <description>${article.excerpt.replace(/&/g, '&amp;')}</description>\n      <enclosure url="${article.image}" type="image/jpeg" length="0" />\n      <category>${article.category}</category>\n    </item>\n`;
          rss = rss.replace('<atom:link href="https://waygass.es/rss.xml" rel="self" type="application/rss+xml"/>\n', `<atom:link href="https://waygass.es/rss.xml" rel="self" type="application/rss+xml"/>\n${newItem}`);
          fs.writeFileSync(rssPath, rss, 'utf8');
          this.addLog('rss.xml actualizado en dist.', 'success');
        }
      }
    } catch (e) {
      this.addLog(`Error al pre-renderizar en dist: ${e.message}`, 'warn');
    }
  }

  // Genera un artículo de alta calidad periodística con Gemini 3.6 Flash
  async generateDailyArticle(options = {}) {
    const { force = false, customTopic = null, customCategory = null } = options;

    if (this.isGenerating) {
      this.addLog('Ya hay una generación en curso. Esperando...', 'warn');
      return { status: 'busy', message: 'Generación en curso' };
    }

    // Comprobación de una noticia al día
    if (!force && (await this.hasArticleForToday())) {
      this.addLog('Ya se ha publicado la noticia diaria de hoy. Omitiendo ejecución (idempotente).', 'info');
      return { status: 'already_published', message: 'Noticia del día ya publicada' };
    }

    this.isGenerating = true;
    this.addLog('🚀 Iniciando motor editorial inteligente con Gemini 3.6 Flash...', 'info');

    try {
      const existingSlugs = await this.getExistingSlugs();

      // Elegir temática
      let chosenIdea;
      if (customTopic) {
        chosenIdea = {
          topic: customTopic,
          category: customCategory || 'Guía Práctica',
          imageKey: 'gasolinera',
          kicker: 'REPORTAJE ESPECIAL'
        };
      } else {
        // Filtrar ideas no utilizadas
        const candidates = HIGH_RETENTION_TOPIC_IDEAS.filter(idea => {
          const roughSlug = idea.topic.toLowerCase().substring(0, 30);
          return !existingSlugs.some(s => s.includes(roughSlug.replace(/[^a-z0-9]/g, '')));
        });

        const pool = candidates.length > 0 ? candidates : HIGH_RETENTION_TOPIC_IDEAS;
        chosenIdea = pool[Math.floor(Math.random() * pool.length)];
      }

      this.addLog(`Tema seleccionado: "${chosenIdea.topic}" (Categoría: ${chosenIdea.category})`, 'info');

      // Seleccionar imagen temática curada
      const coverPhoto = this.pickImage(chosenIdea.imageKey);

      // Fecha actual en hora española
      const now = new Date();
      const dateStr = this.formatSpanishDate(now);
      const isoStr = now.toISOString();

      const systemInstruction = `Eres el redactor jefe y experto en automoción, energía y ahorro de WayGass (portal líder en España en comparación de precios de combustible con datos oficiales de MITECO).
Tu misión es redactar un reportaje periodístico de máxima calidad estilo Xataka / Motorpasión, con retención de lectura brutal, lenguaje divulgativo riguroso y optimización SEO exquisita.

DIRECTRICES EDITORIALES OBLIGATORIAS:
1. TITULAR: Atractivo, intrigante y resolutivo. Entre 50 y 75 caracteres. Sin clickbait vacío; debe prometer una respuesta y darla en el texto.
2. ESTRUCTURA COMPLETA:
   - "kicker": Antetítulo en mayúsculas (ej: "GUÍA DE MANTENIMIENTO", "NORMATIVA DGT", "ANÁLISIS DEL COMBUSTIBLE").
   - "category": Una de estas: 'Ahorro Inteligente', 'Mecánica', 'Tecnología', 'Mantenimiento', 'Guía Práctica', 'Consejos de Viaje', 'Movilidad Ecológica'.
   - "excerpt": Resumen SEO de 140-155 caracteres para la meta description de Google.
   - "lead": Párrafo introductorio potente (2-3 líneas) que sintetiza el conflicto, la física o la norma legal.
   - "intro": Array con exactamente 3 párrafos narrativos que atrapen al lector (la situación cotidiana, el error común y la realidad técnica).
   - "keyPoints": Array con 4 puntos clave ("En 30 segundos: Claves del reportaje") con datos directos y cifras.
   - "quote": Objeto con { "text": "Frase contundente de autoridad", "author": "Entidad o experto (ej: DGT, RACE, IDAE, MITECO, Bosch)" }.
   - "table": Tabla comparativa con { "title": "Título de la tabla", "headers": ["Col 1", "Col 2", "Col 3"], "rows": [["...", "...", "..."], ["...", "...", "..."], ["...", "...", "..."]] }. Debe contener números reales, ahorros en euros o porcentajes.
   - "sections": Array con 4 o 5 secciones profundas. Cada sección debe tener:
     * "heading": Título numerado (ej: "1. Por qué la bomba de inyección sufre en la reserva")
     * "paragraphs": Array de 2 o 3 párrafos de explicación técnica rigurosa y amena.
     * "callout": Objeto opcional { "type": "tip" | "data" | "warning", "title": "Consejo | Dato Clave | Atención", "text": "Texto breve de alto valor" } (al menos 3 secciones deben llevar callout).
   - "verdict": Objeto con { "title": "El veredicto de WayGass: ...", "paragraphs": ["Conclusión aplicable en el día a día", "Mención natural a comparar precios en WayGass antes de repostar para maximizar el ahorro"] }.
   - "readTime": "X min de lectura" (estimar entre 5 y 8 min).
   - "slug": Cadena en minúsculas separada por guiones sin tildes ni caracteres especiales (ej: "multa-dgt-conducir-con-abrigo").

DEBES DEVOLVER EXCLUSIVAMENTE UN OBJETO JSON VÁLIDO CON LOS CAMPOS INDICADOS.`;

      const userPrompt = `Redacta un reportaje periodístico en profundidad para WayGass sobre el siguiente tema:
"${chosenIdea.topic}"

Categoría asignada: ${chosenIdea.category}
Antetítulo sugerido: ${chosenIdea.kicker}

Asegúrate de:
- Escribir en castellano de España, con terminología precisa (gasolina 95, gasóleo A, DGT, MITECO, ITV, inyección directa, l/100km, etc.).
- Incluir cifras concretas de euros y porcentajes para que la tabla y los puntos clave tengan enorme valor de consulta.
- Mantener la máxima profesionalidad editorial y redacción cuidada.`;

      const generated = await this.callGeminiWithFallback(userPrompt, systemInstruction);

      // Validar y limpiar datos
      const cleanSlug = (generated.slug || chosenIdea.topic)
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      // Asegurar unicidad de slug
      let finalSlug = cleanSlug;
      let counter = 1;
      while (existingSlugs.includes(finalSlug)) {
        finalSlug = `${cleanSlug}-${counter++}`;
      }

      const articlePayload = {
        slug: finalSlug,
        title: generated.title || chosenIdea.topic,
        kicker: generated.kicker || chosenIdea.kicker,
        category: generated.category || chosenIdea.category,
        authorName: 'Redacción WayGass',
        authorRole: 'Equipo editorial de Motor y Ahorro',
        authorAvatar: '/logo.png',
        readTime: generated.readTime || '6 min de lectura',
        date: dateStr,
        dateISO: isoStr,
        updatedDate: 'Publicado hoy a las ' + now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        image: coverPhoto.url,
        imageAlt: coverPhoto.alt,
        imageCaption: coverPhoto.caption,
        excerpt: generated.excerpt || 'Reportaje exclusivo de WayGass sobre ahorro de combustible y normativa.',
        lead: generated.lead || generated.excerpt,
        intro: JSON.stringify(generated.intro || []),
        keyPoints: JSON.stringify(generated.keyPoints || []),
        quote: JSON.stringify(generated.quote || null),
        table: JSON.stringify(generated.table || null),
        sections: JSON.stringify(generated.sections || []),
        verdict: JSON.stringify(generated.verdict || null),
        status: 'published',
        isAiGenerated: true,
        views: 0
      };

      // Guardar en la base de datos SQLite
      const createdPost = await db.BlogPost.create(articlePayload);
      const articleJson = createdPost.toArticleJSON();

      this.addLog(`🎉 Artículo guardado en Base de Datos: "${articleJson.title}" (/blog/${articleJson.slug})`, 'success');

      // 1. Sincronizar archivo frontend/src/data/aiArticles.js
      await this.syncAiArticlesFile();

      // 2. Pre-renderizar estáticamente en dist/ si existe
      await this.prerenderArticleInDist(articleJson);

      // 3. Notificar a Telegram si está activo
      await this.notifyTelegram(articleJson);

      return {
        status: 'success',
        article: articleJson
      };
    } catch (err) {
      this.addLog(`Error crítico durante la generación editorial: ${err.message}`, 'error');
      return {
        status: 'error',
        error: err.message
      };
    } finally {
      this.isGenerating = false;
    }
  }
}

const blogAutomationService = new BlogAutomationService();
module.exports = blogAutomationService;
