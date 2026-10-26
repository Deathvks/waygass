import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, "../dist");

const templatePath = path.join(distDir, "index.html");
if (!fs.existsSync(templatePath)) {
  console.error("dist/index.html not found. Run vite build first.");
  process.exit(1);
}

const template = fs.readFileSync(templatePath, "utf8");

const pages = [
  {
    path: "/blog",
    title: "Blog de Ahorro y Combustible | Guías y Noticias WayGass",
    description: "Consejos prácticos, guías de conducción eficiente, análisis de gasolineras y trucos para reducir tu gasto anual en combustible en España.",
    canonical: "https://waygass.es/blog",
    image: "https://waygass.es/logo.png",
    type: "website"
  },
  {
    path: "/blog/5-trucos-ahorrar-combustible",
    title: "5 Trucos infalibles para ahorrar combustible en cada viaje | WayGass",
    description: "¿Sabías que la presión de los neumáticos o el uso del aire acondicionado disparan tu consumo? Aprende cómo optimizar tu depósito de gasolina o diésel.",
    canonical: "https://waygass.es/blog/5-trucos-ahorrar-combustible",
    image: "https://waygass.es/blog-eco-driving.jpg",
    type: "article",
    datePublished: "2026-09-20T08:00:00+02:00",
    dateModified: "2026-10-26T12:00:00+02:00"
  },
  {
    path: "/blog/gasolineras-lowcost-mito-realidad",
    title: "Gasolineras Low-Cost: ¿Mito o realidad sobre la calidad? | WayGass",
    description: "Desmentimos los mitos de las gasolineras low cost. ¿El combustible barato estropea el motor? Analizamos la procedencia de Exolum/CLH y aditivos.",
    canonical: "https://waygass.es/blog/gasolineras-lowcost-mito-realidad",
    image: "https://waygass.es/blog-low-cost.jpg",
    type: "article",
    datePublished: "2026-09-18T08:00:00+02:00",
    dateModified: "2026-10-26T12:00:00+02:00"
  },
  {
    path: "/blog/mejores-apps-coche-2026",
    title: "Las 5 mejores apps para conductores en 2026 | WayGass",
    description: "Las mejores aplicaciones imprescindibles para tu coche en 2026: comparadores de precios de gasolineras, Waze, Drivvo y aparcamiento inteligente.",
    canonical: "https://waygass.es/blog/mejores-apps-coche-2026",
    image: "https://waygass.es/blog-apps-car.jpg",
    type: "article",
    datePublished: "2026-09-25T08:00:00+02:00",
    dateModified: "2026-10-26T12:00:00+02:00"
  },
  {
    path: "/blog/mantenimiento-preventivo-consumo",
    title: "Mantenimiento preventivo: ¿Afecta al consumo? | WayGass",
    description: "Filtros sucios, bujías desgastadas y aceite degradado pueden aumentar tu consumo un 10%. Descubre cómo el mantenimiento te ahorra dinero en combustible.",
    canonical: "https://waygass.es/blog/mantenimiento-preventivo-consumo",
    image: "https://waygass.es/blog-maintenance.jpg",
    type: "article",
    datePublished: "2026-09-28T08:00:00+02:00",
    dateModified: "2026-10-26T12:00:00+02:00"
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

pages.forEach(p => {
  let html = template;

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
  if (p.type === "article") {
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      "headline": p.title,
      "description": p.description,
      "image": [p.image],
      "datePublished": p.datePublished,
      "dateModified": p.dateModified || p.datePublished,
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
  }

  // Target directory
  const relativeDir = p.path.replace(/^\//, "");
  const targetDir = path.join(distDir, relativeDir);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const targetFile = path.join(targetDir, "index.html");
  fs.writeFileSync(targetFile, html, "utf8");
  console.log(`Pre-rendered: ${p.path} -> ${path.relative(distDir, targetFile)}`);
});

console.log("SSG pre-rendering completed successfully.");
