import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { PROVINCES_DATA } from "../src/data/provincesData.js";
import { BLOG_POSTS } from "../src/data/blogData.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, "../dist");
const publicDir = path.resolve(__dirname, "../public");

const templatePath = path.join(distDir, "index.html");
if (!fs.existsSync(templatePath)) {
  console.error("dist/index.html not found. Run vite build first.");
  process.exit(1);
}

const template = fs.readFileSync(templatePath, "utf8");

const staticPages = [
  {
    path: "/blog",
    title: "Blog de Ahorro y Combustible | Guías y Consejos WayGass",
    description: "Consejos prácticos, guías de conducción eficiente, análisis de gasolineras low-cost y trucos para reducir tu gasto anual en combustible en España.",
    canonical: "https://waygass.es/blog",
    image: "https://waygass.es/logo.png",
    type: "website"
  },
  {
    path: "/gasolineras",
    title: "Gasolineras Baratas por Provincia en España - Directorio Oficial | WayGass",
    description: "Directorio de gasolineras más baratas de España por provincias y comunidades autónomas. Compara precios actualizados hoy de Gasolina 95, Diésel y GLP.",
    canonical: "https://waygass.es/gasolineras",
    image: "https://waygass.es/logo.png",
    type: "website",
    isDirectory: true
  },
  {
    path: "/privacidad",
    title: "Política de Privacidad | WayGass",
    description: "Información detallada sobre el tratamiento de datos y privacidad en WayGass.",
    canonical: "https://waygass.es/privacidad",
    type: "website"
  },
  {
    path: "/legal",
    title: "Aviso Legal y Condiciones de Uso | WayGass",
    description: "Términos legales y condiciones de uso del servicio WayGass.",
    canonical: "https://waygass.es/legal",
    type: "website"
  },
  {
    path: "/cookies",
    title: "Política de Cookies y Almacenamiento | WayGass",
    description: "Información sobre las cookies y el almacenamiento local utilizado en WayGass.",
    canonical: "https://waygass.es/cookies",
    type: "website"
  }
];

// Generar las páginas de los 14 artículos del blog
const blogPages = BLOG_POSTS.map(post => ({
  path: `/blog/${post.slug}`,
  title: `${post.title} | WayGass`,
  description: post.excerpt,
  canonical: `https://waygass.es/blog/${post.slug}`,
  image: `https://waygass.es${post.image}`,
  type: "article",
  datePublished: post.dateISO,
  dateModified: post.dateISO,
  isBlogArticle: true,
  post
}));

// Generar las páginas de las 52 provincias para SEO Programático
const provincePages = PROVINCES_DATA.map(prov => ({
  path: `/gasolineras/${prov.slug}`,
  title: `Gasolineras Más Baratas en ${prov.name} Hoy - Precios Diésel y Gasolina 95 | WayGass`,
  description: `Compara y encuentra las gasolineras más baratas de ${prov.name} en tiempo real. Precios actualizados hoy de Gasolina 95, Diésel y GLP con datos oficiales de MITECO. Ahorra hasta 15€ por depósito.`,
  canonical: `https://waygass.es/gasolineras/${prov.slug}`,
  image: "https://waygass.es/logo.png",
  type: "website",
  isProvince: true,
  province: prov
}));

const allPages = [...staticPages, ...blogPages, ...provincePages];

allPages.forEach(p => {
  let html = template;

  // Remove homepage schema from subpages
  html = html.replace(/<script id="schema-homepage"[\s\S]*?<\/script>\s*/i, "");

  // Replace Title
  html = html.replace(/<title>[^<]*<\/title>/i, `<title>${p.title}</title>`);

  // Replace Description
  html = html.replace(/<meta name="description" content="[^"]*"/i, `<meta name="description" content="${p.description}"`);

  // Canonical
  html = html.replace(/<link rel="canonical" href="[^"]*"/i, `<link rel="canonical" href="${p.canonical}"`);

  // OG Title & Desc
  html = html.replace(/<meta property="og:title" content="[^"]*"/i, `<meta property="og:title" content="${p.title}"`);
  html = html.replace(/<meta property="og:description" content="[^"]*"/i, `<meta property="og:description" content="${p.description}"`);
  html = html.replace(/<meta property="og:url" content="[^"]*"/i, `<meta property="og:url" content="${p.canonical}"`);
  html = html.replace(/<meta property="og:type" content="[^"]*"/i, `<meta property="og:type" content="${p.type || "website"}"`);

  if (p.image) {
    html = html.replace(/<meta property="og:image" content="[^"]*"/i, `<meta property="og:image" content="${p.image}"`);
    html = html.replace(/<meta name="twitter:image" content="[^"]*"/i, `<meta name="twitter:image" content="${p.image}"`);
  }

  // Twitter
  html = html.replace(/<meta name="twitter:title" content="[^"]*"/i, `<meta name="twitter:title" content="${p.title}"`);
  html = html.replace(/<meta name="twitter:description" content="[^"]*"/i, `<meta name="twitter:description" content="${p.description}"`);

  // JSON-LD structured data
  if (p.isBlogArticle) {
    const post = p.post;
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      "headline": post.title,
      "description": post.excerpt,
      "image": [`https://waygass.es${post.image}`],
      "datePublished": post.dateISO,
      "dateModified": post.dateISO,
      "inLanguage": "es-ES",
      "author": [{
        "@type": "Organization",
        "name": "Equipo Editorial de WayGass",
        "url": "https://waygass.es"
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
        "@id": p.canonical
      }
    };

    const schemaTag = `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script></head>`;
    html = html.replace("</head>", schemaTag);

    const articleNoscript = `<noscript>
      <div style="padding: 2rem; max-width: 800px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <h1>${post.title}</h1>
        <p>${post.excerpt}</p>
        <h2>Puntos clave en 30 segundos</h2>
        <ul>
          ${(post.keyPoints || []).map(k => `<li>${k}</li>`).join("\n          ")}
        </ul>
        ${(post.sections || []).map(s => `<h2>${s.heading}</h2>\n${s.paragraphs.map(pr => `<p>${pr}</p>`).join("\n")}`).join("\n\n        ")}
        <p><a href="/blog">&larr; Volver al blog</a> | <a href="/">Ver precios de gasolineras en el mapa</a></p>
      </div>
    </noscript>`;

    html = html.replace(/<noscript>[\s\S]*?<\/noscript>/i, articleNoscript);
  } else if (p.isProvince) {
    const prov = p.province;
    const schemas = [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://waygass.es/" },
          { "@type": "ListItem", "position": 2, "name": "Gasolineras", "item": "https://waygass.es/gasolineras" },
          { "@type": "ListItem", "position": 3, "name": prov.name, "item": p.canonical }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": `¿Cuál es la gasolinera más barata hoy en ${prov.name}?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `WayGass recopila en tiempo real las tarifas de todas las estaciones de servicio de ${prov.name} utilizando los datos oficiales del Ministerio para la Transición Ecológica (MITECO). Consulta nuestro ranking interactivo para ver la estación más barata en este momento.`
            }
          },
          {
            "@type": "Question",
            "name": `¿Cuánto dinero puedo ahorrar al repostar en ${prov.name}?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `La diferencia de precio entre estaciones tradicionales y redes de bajo coste en ${prov.name} permite un ahorro medio de entre 10€ y 18€ por cada depósito de 50 litros.`
            }
          },
          {
            "@type": "Question",
            "name": `¿A qué hora se actualizan los precios de combustible en ${prov.name}?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `Los precios se sincronizan continuamente conforme las estaciones de servicio remiten sus modificaciones legales al Ministerio de Industria y Transición Ecológica.`
            }
          }
        ]
      }
    ];

    const schemaTag = `<script type="application/ld+json">${JSON.stringify(schemas)}</script></head>`;
    html = html.replace("</head>", schemaTag);

    const provinceNoscript = `<noscript>
      <div style="padding: 2rem; max-width: 800px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <h1>Gasolineras Más Baratas en ${prov.name} Hoy</h1>
        <p>Encuentra las estaciones de servicio con el precio más bajo de Gasolina 95, Diésel A, Gasolina 98 y GLP en toda la provincia de <strong>${prov.name}</strong> (${prov.region}). Precios oficiales del Ministerio para la Transición Ecológica (MITECO) actualizados continuamente.</p>
        
        <p><a href="/?provincia=${prov.id}" style="font-weight: bold; color: #ff3b30;">Abrir mapa interactivo de ${prov.name} en WayGass &rarr;</a></p>

        <h2>Municipios destacados para repostar barato en ${prov.name}</h2>
        <ul>
          ${prov.popularMunicipalities.map(m => `<li>Gasolineras baratas en ${m}</li>`).join("\n          ")}
        </ul>

        <h2>Preguntas Frecuentes sobre el combustible en ${prov.name}</h2>
        <h3>¿Cuál es la gasolinera más económica en ${prov.name}?</h3>
        <p>Los precios oscilan diariamente. Las gasolineras automáticas e independientes suelen ofrecer tarifas entre 10 y 20 céntimos por litro más baratas que las grandes redes tradicionales.</p>

        <h3>¿Cuánto puedo ahorrar por depósito?</h3>
        <p>En un vehículo estándar con depósito de 50 litros, el ahorro puede superar los 15€ por repostaje en la provincia de ${prov.name}.</p>

        <h2>Gasolineras en Provincias Cercanas</h2>
        <ul>
          ${(prov.nearbySlugs || []).map(s => {
            const nearby = PROVINCES_DATA.find(x => x.slug === s);
            return `<li><a href="/gasolineras/${s}">Gasolineras más baratas en ${nearby ? nearby.name : s}</a></li>`;
          }).join("\n          ")}
        </ul>

        <p><a href="/gasolineras">&larr; Volver al directorio de todas las provincias</a></p>
      </div>
    </noscript>`;

    html = html.replace(/<noscript>[\s\S]*?<\/noscript>/i, provinceNoscript);
  } else if (p.isDirectory) {
    const dirNoscript = `<noscript>
      <div style="padding: 2rem; max-width: 800px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <h1>Directorio de Gasolineras Más Baratas de España por Provincia</h1>
        <p>Selecciona tu provincia para consultar en tiempo real las estaciones de servicio más económicas de Gasolina 95, Diésel y GLP con datos oficiales de MITECO.</p>
        <ul>
          ${PROVINCES_DATA.map(prov => `<li><a href="/gasolineras/${prov.slug}">Gasolineras baratas en ${prov.name} (${prov.capital})</a></li>`).join("\n          ")}
        </ul>
      </div>
    </noscript>`;
    html = html.replace(/<noscript>[\s\S]*?<\/noscript>/i, dirNoscript);
  }

  // Target directory
  const relativeDir = p.path.replace(/^\//, "");
  const targetDir = path.join(distDir, relativeDir);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const targetFile = path.join(targetDir, "index.html");
  fs.writeFileSync(targetFile, html, "utf8");
});

console.log(`Pre-rendered ${allPages.length} pages successfully.`);

// GENERACIÓN AUTOMÁTICA DEL SITEMAP.XML COMPLETO
const today = new Date().toISOString().split("T")[0];
let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>https://waygass.es/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://waygass.es/gasolineras</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
`;

PROVINCES_DATA.forEach(prov => {
  sitemapXml += `  <url>
    <loc>https://waygass.es/gasolineras/${prov.slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
`;
});

sitemapXml += `  <url>
    <loc>https://waygass.es/blog</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
`;

BLOG_POSTS.forEach(post => {
  sitemapXml += `  <url>
    <loc>https://waygass.es/blog/${post.slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
    <image:image>
      <image:loc>https://waygass.es${post.image}</image:loc>
      <image:title>${post.title.replace(/&/g, '&amp;')}</image:title>
    </image:image>
  </url>
`;
});

sitemapXml += `  <url>
    <loc>https://waygass.es/privacidad</loc>
    <lastmod>${today}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>https://waygass.es/legal</loc>
    <lastmod>${today}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>https://waygass.es/cookies</loc>
    <lastmod>${today}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
</urlset>
`;

fs.writeFileSync(path.join(distDir, "sitemap.xml"), sitemapXml, "utf8");
fs.writeFileSync(path.join(publicDir, "sitemap.xml"), sitemapXml, "utf8");
console.log("Sitemap.xml updated with all URLs.");

// GENERACIÓN AUTOMÁTICA DEL RSS.XML COMPLETO
let rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>WayGass Blog | Consejos de Ahorro y Combustible</title>
    <link>https://waygass.es/blog</link>
    <description>Guías de conducción eficiente, análisis de combustibles y trucos probados para reducir tu consumo en cada repostaje en España.</description>
    <language>es-ES</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="https://waygass.es/rss.xml" rel="self" type="application/rss+xml"/>
`;

BLOG_POSTS.forEach(post => {
  const pubDate = new Date(post.dateISO).toUTCString();
  rssXml += `    <item>
      <title>${post.title.replace(/&/g, '&amp;')}</title>
      <link>https://waygass.es/blog/${post.slug}</link>
      <guid isPermaLink="true">https://waygass.es/blog/${post.slug}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${post.excerpt.replace(/&/g, '&amp;')}</description>
      <enclosure url="https://waygass.es${post.image}" type="image/jpeg" length="0" />
      <category>${post.category}</category>
    </item>
`;
});

rssXml += `  </channel>
</rss>
`;

fs.writeFileSync(path.join(distDir, "rss.xml"), rssXml, "utf8");
fs.writeFileSync(path.join(publicDir, "rss.xml"), rssXml, "utf8");
console.log(`RSS.xml updated with ${BLOG_POSTS.length} articles.`);
