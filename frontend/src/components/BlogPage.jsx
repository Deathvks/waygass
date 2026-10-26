import React, { useState, useEffect } from 'react';
import SEOHead from './SEOHead.jsx';
import { BLOG_POSTS, getBlogPostBySlug } from '../data/blogData.js';

// BARRA DE PROGRESO DE LECTURA (ESTILO XATAKA)
const ReadingProgressBar = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-transparent z-[100] pointer-events-none">
      <div 
        className="h-full bg-gradient-to-r from-primary via-emerald-400 to-primary-dark transition-all duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

// LAYOUT COMÚN DEL BLOG
const BlogLayout = ({ children }) => (
  <div className="min-h-screen bg-[#f8fafc] dark:bg-[#07090e] text-slate-900 dark:text-slate-100 font-sans selection:bg-primary selection:text-white">
    <ReadingProgressBar />
    
    {/* CABECERA EDITORIAL */}
    <header className="px-4 sm:px-8 py-4 border-b border-slate-200 dark:border-white/10 bg-white/80 dark:bg-[#07090e]/80 backdrop-blur-xl sticky top-0 z-50 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <a href="/" className="flex items-center gap-2.5 hover:opacity-85 transition-opacity group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg shadow-primary/25">
            <i className="fa-solid fa-gas-pump text-white text-base"></i>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight leading-none">
              Way<span className="text-primary">Gass</span>
            </span>
            <span className="text-[10px] uppercase tracking-widest font-extrabold text-slate-400 dark:text-slate-500">
              Motor & Energía
            </span>
          </div>
        </a>

        <nav className="hidden lg:flex items-center gap-5 text-xs font-bold text-slate-600 dark:text-slate-400 border-l border-slate-200 dark:border-white/10 pl-6">
          <a href="/blog" className="text-primary hover:text-primary-dark transition-colors">Actualidad</a>
          <a href="/gasolineras" className="hover:text-primary transition-colors">Gasolineras por Provincia</a>
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <a 
          href="/" 
          className="px-4 py-2 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl text-xs sm:text-sm transition-all hover:scale-105 shadow-md shadow-primary/20 flex items-center gap-2"
        >
          <i className="fa-solid fa-map-location-dot"></i>
          <span>Mapa de Precios</span>
        </a>
      </div>
    </header>

    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {children}
    </main>

    {/* PIE DE PÁGINA */}
    <footer className="py-12 px-6 border-t border-slate-200 dark:border-white/10 text-center text-sm text-slate-500 mt-20 bg-white dark:bg-[#0a0d14]">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex items-center justify-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center text-white text-xs">
            <i className="fa-solid fa-gas-pump"></i>
          </div>
          <span className="font-black text-slate-800 dark:text-white">WayGass Motor</span>
        </div>
        <p className="text-xs text-slate-400 max-w-xl mx-auto">
          Portal editorial especializado en ahorro de combustible, normativa de tráfico, mecánica preventiva y análisis del mercado de hidrocarburos con datos oficiales de MITECO en España.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-5 pt-3 text-xs font-semibold">
          <a href="/" className="hover:text-primary transition-colors">Mapa en Vivo</a>
          <a href="/gasolineras" className="hover:text-primary transition-colors">Gasolineras por Provincia</a>
          <a href="/blog" className="hover:text-primary transition-colors">Blog y Noticias</a>
          <a href="/legal" className="hover:text-primary transition-colors">Aviso Legal</a>
          <a href="/privacidad" className="hover:text-primary transition-colors">Privacidad</a>
          <a href="/cookies" className="hover:text-primary transition-colors">Cookies</a>
        </div>
        <p className="text-[11px] text-slate-400 pt-4">&copy; {new Date().getFullYear()} WayGass. Todos los derechos reservados.</p>
      </div>
    </footer>
  </div>
);

// CAJA DE PUNTOS CLAVE EN 30 SEGUNDOS (ESTILO XATAKA)
const KeyTakeawaysBox = ({ points }) => (
  <aside aria-label="Puntos clave del artículo" className="my-8 p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/5 border border-primary/20 backdrop-blur-sm shadow-sm">
    <div className="flex items-center gap-2.5 mb-4 text-primary font-black text-xs uppercase tracking-wider">
      <div className="w-6 h-6 rounded-lg bg-primary text-white flex items-center justify-center text-xs shadow-sm">
        <i className="fa-solid fa-bolt"></i>
      </div>
      <span>En 30 segundos: Claves del reportaje</span>
    </div>
    <ul className="space-y-3">
      {points.map((pt, idx) => (
        <li key={idx} className="flex items-start gap-3 text-sm md:text-base text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
          <i className="fa-solid fa-circle-check text-primary mt-1 text-sm shrink-0"></i>
          <span>{pt}</span>
        </li>
      ))}
    </ul>
  </aside>
);

// BLOQUE DE CITA DESTACADA (PULL QUOTE ESTILO XATAKA)
const PullQuote = ({ quote }) => {
  if (!quote) return null;
  return (
    <figure className="my-10 p-6 sm:p-8 rounded-2xl border-l-4 border-primary bg-slate-100/70 dark:bg-white/5 relative overflow-hidden">
      <i className="fa-solid fa-quote-left text-4xl text-primary/20 absolute top-4 right-6 pointer-events-none"></i>
      <blockquote className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-relaxed italic">
        "{quote.text}"
      </blockquote>
      {quote.author && (
        <figcaption className="mt-3 text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
          — {quote.author}
        </figcaption>
      )}
    </figure>
  );
};

// TABLA COMPARATIVA RESPONSIVE (ESTILO XATAKA)
const DataTable = ({ table }) => {
  if (!table) return null;
  return (
    <div className="my-10 overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm bg-white dark:bg-[#0c1017]">
      {table.title && (
        <div className="px-5 py-3.5 bg-slate-100 dark:bg-white/5 border-b border-slate-200 dark:border-white/10 font-black text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <i className="fa-solid fa-table-list text-primary"></i>
          <span>{table.title}</span>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.02] text-slate-500 dark:text-slate-400 font-black uppercase text-[11px] tracking-wider">
              {table.headers.map((h, i) => (
                <th key={i} className="py-3 px-4 font-extrabold whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/5">
            {table.rows.map((row, rIdx) => (
              <tr key={rIdx} className="hover:bg-slate-50/80 dark:hover:bg-white/[0.02] transition-colors">
                {row.map((cell, cIdx) => (
                  <td key={cIdx} className={`py-3.5 px-4 text-slate-800 dark:text-slate-200 ${cIdx === 0 ? 'font-bold' : ''}`}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// DESTACADO DE CONSEJO / ALERTA (CALLOUT)
const CalloutBox = ({ callout }) => {
  if (!callout) return null;
  const isTip = callout.type === 'tip';
  const isData = callout.type === 'data';

  return (
    <aside className={`my-6 p-5 rounded-xl border flex items-start gap-3.5 text-sm leading-relaxed ${
      isTip 
        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-950 dark:text-emerald-200' 
        : isData
        ? 'bg-blue-500/10 border-blue-500/20 text-blue-950 dark:text-blue-200'
        : 'bg-amber-500/10 border-amber-500/20 text-amber-950 dark:text-amber-200'
    }`}>
      <div className="mt-0.5 shrink-0 text-base">
        {isTip ? (
          <i className="fa-solid fa-lightbulb text-emerald-500"></i>
        ) : isData ? (
          <i className="fa-solid fa-chart-simple text-blue-500"></i>
        ) : (
          <i className="fa-solid fa-triangle-exclamation text-amber-500"></i>
        )}
      </div>
      <div>
        {callout.title && <strong className="block font-black mb-1 text-xs uppercase tracking-wide">{callout.title}</strong>}
        <span>{callout.text}</span>
      </div>
    </aside>
  );
};

// BOTONES DE COMPARTIR EN REDES
const ShareBar = ({ title, url }) => {
  const [copied, setCopied] = useState(false);
  const currentUrl = url || (typeof window !== "undefined" ? window.location.href : "https://waygass.es/blog");

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 my-6 py-4 border-y border-slate-200 dark:border-white/10 text-xs font-bold text-slate-500">
      <div className="flex items-center gap-2">
        <i className="fa-solid fa-share-nodes text-slate-400"></i>
        <span>Compartir:</span>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <button 
          type="button"
          onClick={handleCopy}
          className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <i className={copied ? "fa-solid fa-check text-emerald-500" : "fa-solid fa-link"}></i>
          <span>{copied ? "¡Copiado!" : "Copiar"}</span>
        </button>
        <a 
          href={`https://wa.me/?text=${encodeURIComponent(title + " " + currentUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <i className="fa-brands fa-whatsapp text-sm"></i>
          <span>WhatsApp</span>
        </a>
        <a 
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(currentUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <i className="fa-brands fa-x-twitter text-sm"></i>
          <span>X / Twitter</span>
        </a>
        <a 
          href={`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(title)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-600 dark:text-sky-400 transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <i className="fa-brands fa-telegram text-sm"></i>
          <span>Telegram</span>
        </a>
      </div>
    </div>
  );
};

// FICHA DEL AUTOR AL FINAL DEL ARTÍCULO (ESTILO XATAKA)
const AuthorBioCard = ({ author }) => {
  if (!author) return null;
  return (
    <div className="my-10 p-6 rounded-2xl bg-slate-100/60 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 flex items-center gap-4">
      <div className="w-14 h-14 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary text-xl font-black shrink-0 overflow-hidden">
        {author.avatar ? (
          <img src={author.avatar} alt={author.name} className="w-full h-full object-cover" />
        ) : (
          author.name.charAt(0)
        )}
      </div>
      <div>
        <div className="text-[10px] uppercase font-black tracking-widest text-primary">Redacción WayGass Motor</div>
        <h4 className="font-black text-base text-slate-900 dark:text-white">{author.name}</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{author.role}</p>
      </div>
    </div>
  );
};

// BANNER INTERACTIVO EN EL ARTÍCULO
const InArticleCta = () => (
  <aside aria-label="Herramienta de ahorro" className="my-12 p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-white/10">
    <div className="space-y-2 text-center md:text-left">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-black uppercase tracking-wider">
        <i className="fa-solid fa-gas-pump"></i> Ahorro inmediato
      </div>
      <h3 className="text-xl md:text-2xl font-black">¿Quieres saber el precio exacto ahora mismo en tu zona?</h3>
      <p className="text-slate-300 text-sm max-w-md">Consulta en el mapa interactivo de WayGass los precios actualizados por el Ministerio cada 30 minutos.</p>
    </div>
    <a 
      href="/" 
      className="px-6 py-3.5 bg-primary hover:bg-primary-dark text-white font-black rounded-xl text-sm transition-transform hover:scale-105 shadow-lg shadow-primary/30 shrink-0 flex items-center gap-2 cursor-pointer"
    >
      <span>Abrir mapa de gasolineras</span>
      <i className="fa-solid fa-arrow-right text-xs"></i>
    </a>
  </aside>
);

// MIGA DE PAN
const Breadcrumbs = ({ category, currentTitle }) => (
  <nav aria-label="Miga de pan" className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-6 overflow-hidden text-ellipsis whitespace-nowrap">
    <a href="/" className="hover:text-primary transition-colors flex items-center gap-1">
      <i className="fa-solid fa-house text-[10px]"></i>
      <span>Inicio</span>
    </a>
    <span>/</span>
    <a href="/blog" className="hover:text-primary transition-colors">Blog</a>
    {category && (
      <>
        <span>/</span>
        <span className="text-slate-500 dark:text-slate-400">{category}</span>
      </>
    )}
  </nav>
);

// ARTÍCULOS RELACIONADOS (3 COLUMNAS)
const RelatedArticles = ({ currentSlug }) => {
  const related = BLOG_POSTS.filter(p => p.slug !== currentSlug).slice(0, 3);

  return (
    <div className="mt-16 pt-12 border-t border-slate-200 dark:border-white/10">
      <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2.5">
        <i className="fa-solid fa-newspaper text-primary"></i>
        <span>Reportajes recomendados</span>
      </h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {related.map(p => (
          <a
            key={p.slug}
            href={`/blog/${p.slug}`}
            className="group block bg-white dark:bg-[#0c1017] rounded-2xl border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm hover:shadow-lg transition-all"
          >
            <div className="aspect-[16/9] overflow-hidden relative">
              <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <span className="absolute bottom-2.5 left-2.5 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-black/70 text-white backdrop-blur-sm">
                {p.category}
              </span>
            </div>
            <div className="p-4">
              <div className="text-[11px] text-slate-400 mb-1">{p.readTime}</div>
              <h4 className="font-bold text-sm text-slate-800 dark:text-white group-hover:text-primary transition-colors line-clamp-2">
                {p.title}
              </h4>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

// ==============================================================================
// VISTA DETALLADA DEL ARTÍCULO (ESTILO XATAKA)
// ==============================================================================
export const BlogPostPage = ({ slug }) => {
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return (
      <BlogLayout>
        <div className="text-center py-20 space-y-4">
          <h1 className="text-3xl font-black">Artículo no encontrado</h1>
          <p className="text-slate-500">El reportaje solicitado no existe o ha sido modificado.</p>
          <a href="/blog" className="inline-block px-6 py-3 bg-primary text-white font-bold rounded-xl hover:scale-105 transition-transform">
            Volver al listado de noticias
          </a>
        </div>
      </BlogLayout>
    );
  }

  const canonicalUrl = `https://waygass.es/blog/${post.slug}`;

  return (
    <BlogLayout>
      <SEOHead 
        title={`${post.title} | WayGass Motor`}
        description={post.excerpt}
        canonical={canonicalUrl}
        image={`https://waygass.es${post.image}`}
        type="article"
        publishedTime={post.dateISO}
        modifiedTime={post.dateISO}
        breadcrumbs={[
          { name: "Inicio", url: "https://waygass.es/" },
          { name: "Blog", url: "https://waygass.es/blog" },
          { name: post.title, url: canonicalUrl }
        ]}
      />

      <article className="max-w-3xl mx-auto">
        <Breadcrumbs category={post.category} currentTitle={post.title} />

        {/* KICKER Y CATEGORÍA */}
        <div className="mb-3">
          <span className="inline-block text-xs font-black text-primary uppercase tracking-widest px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
            {post.kicker || post.category}
          </span>
        </div>

        {/* TITULAR PRINCIPAL (GRAN FORMATO EDITORIAL) */}
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black mb-5 tracking-tight leading-[1.15] text-slate-900 dark:text-white">
          {post.title}
        </h1>

        {/* SUBTÍTULO / ENTRADILLA DESTACADA */}
        {post.lead && (
          <p className="text-lg sm:text-xl text-slate-700 dark:text-slate-300 leading-relaxed mb-6 font-medium border-l-4 border-primary pl-4 italic">
            {post.lead}
          </p>
        )}

        {/* FIRMA Y METADATOS DEL AUTOR (ESTILO XATAKA) */}
        <div className="flex items-center justify-between flex-wrap gap-4 py-4 border-t border-slate-200 dark:border-white/10 my-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-black text-primary overflow-hidden shrink-0">
              {post.author?.avatar ? (
                <img src={post.author.avatar} alt={post.author.name} className="w-full h-full object-cover" />
              ) : (
                "W"
              )}
            </div>
            <div>
              <div className="font-black text-slate-900 dark:text-white">
                Por {post.author?.name || "Redacción WayGass"}
              </div>
              <div className="text-slate-500 dark:text-slate-400 text-[11px]">
                {post.author?.role || "Especialista en Motor"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 font-semibold text-[11px]">
            <span><i className="fa-regular fa-calendar mr-1"></i>{post.date}</span>
            <span>&bull;</span>
            <span><i className="fa-regular fa-clock mr-1"></i>{post.readTime}</span>
            {post.updatedDate && (
              <>
                <span className="hidden sm:inline">&bull;</span>
                <span className="hidden sm:inline text-emerald-600 dark:text-emerald-400 font-bold">{post.updatedDate}</span>
              </>
            )}
          </div>
        </div>

        {/* BARRA DE COMPARTIR SUPERIOR */}
        <ShareBar title={post.title} url={canonicalUrl} />

        {/* FOTO PRINCIPAL CON PIE DE FOTO EDITORIAL */}
        <figure className="my-8 rounded-3xl overflow-hidden shadow-2xl bg-black">
          <img 
            src={post.image} 
            alt={post.imageAlt || post.title} 
            width="1200" 
            height="675" 
            className="w-full aspect-[16/9] object-cover" 
          />
          {post.imageCaption && (
            <figcaption className="text-xs text-slate-500 dark:text-slate-400 text-center py-2.5 px-4 bg-slate-100 dark:bg-white/[0.03] italic border-t border-slate-200 dark:border-white/5">
              {post.imageCaption}
            </figcaption>
          )}
        </figure>

        {/* CAJA DE PUNTOS CLAVE */}
        {post.keyPoints && post.keyPoints.length > 0 && (
          <KeyTakeawaysBox points={post.keyPoints} />
        )}

        {/* CITA PULL-QUOTE */}
        {post.quote && <PullQuote quote={post.quote} />}

        {/* TABLA COMPARATIVA SI DISPONE DE ELLA */}
        {post.table && <DataTable table={post.table} />}

        {/* CUERPO DEL REPORTAJE */}
        <div className="space-y-10 mt-10">
          {post.sections.map((section, idx) => (
            <div key={idx} className="space-y-4">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                <span className="w-1.5 h-6 rounded-full bg-primary inline-block"></span>
                <span>{section.heading}</span>
              </h2>
              {section.paragraphs.map((para, pIdx) => (
                <p key={pIdx} className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                  {para}
                </p>
              ))}
              {section.callout && <CalloutBox callout={section.callout} />}
            </div>
          ))}
        </div>

        {/* CTA DENTRO DEL ARTÍCULO */}
        <InArticleCta />

        {/* FICHA BIOGRÁFICA DEL AUTOR */}
        <AuthorBioCard author={post.author} />

        {/* BARRA DE COMPARTIR INFERIOR */}
        <ShareBar title={post.title} url={canonicalUrl} />

        {/* REPORTAJES RECOMENDADOS */}
        <RelatedArticles currentSlug={post.slug} />
      </article>
    </BlogLayout>
  );
};

// ==============================================================================
// PORTADA DEL BLOG (ESTILO REVISTA XATAKA)
// ==============================================================================
export const BlogIndex = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    'all',
    'Ahorro Inteligente',
    'Mecánica',
    'Tecnología',
    'Mantenimiento',
    'Guía Práctica',
    'Consejos de Viaje',
    'Movilidad Ecológica'
  ];

  const filteredPosts = selectedCategory === 'all'
    ? BLOG_POSTS
    : BLOG_POSTS.filter(p => p.category === selectedCategory);

  // ARTÍCULO DESTACADO DE PORTADA (EL PRIMERO O EL DE DÍA MÁS BARATO)
  const featuredPost = BLOG_POSTS[4] || BLOG_POSTS[0]; // ¿Qué día es más barata la gasolina?
  const trendingPosts = BLOG_POSTS.slice(0, 3);

  return (
    <BlogLayout>
      <SEOHead 
        title="WayGass Motor & Energía | Noticias, Análisis de Precios y Guías"
        description="Consejos prácticos, guías de conducción eficiente, análisis de gasolineras low-cost y trucos probados para reducir tu consumo de gasolina o diésel en España."
        canonical="https://waygass.es/blog"
        breadcrumbs={[
          { name: "Inicio", url: "https://waygass.es/" },
          { name: "Blog", url: "https://waygass.es/blog" }
        ]}
      />

      {/* PORTADA HERO ESTILO XATAKA ("TEMA DEL DÍA") */}
      {selectedCategory === 'all' && (
        <section className="mb-14">
          <div 
            onClick={() => window.location.href = `/blog/${featuredPost.slug}`}
            className="group block bg-white dark:bg-[#0c1017] rounded-3xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-xl hover:shadow-2xl transition-all cursor-pointer grid lg:grid-cols-12 gap-0"
          >
            <div className="lg:col-span-7 aspect-[16/9] lg:aspect-auto overflow-hidden relative">
              <img 
                src={featuredPost.image} 
                alt={featuredPost.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
              />
              <span className="absolute top-4 left-4 text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full bg-primary text-white shadow-lg">
                Tema del Día
              </span>
            </div>
            <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-primary mb-2 block">
                  {featuredPost.kicker || featuredPost.category}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black leading-tight text-slate-900 dark:text-white group-hover:text-primary transition-colors mb-4">
                  {featuredPost.title}
                </h2>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed mb-6 font-medium">
                  {featuredPost.lead || featuredPost.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400">
                  <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary text-[10px]">
                    {featuredPost.author?.name ? featuredPost.author.name.charAt(0) : "W"}
                  </div>
                  <span className="font-bold text-slate-700 dark:text-slate-300">{featuredPost.author?.name}</span>
                  <span>&bull;</span>
                  <span>{featuredPost.readTime}</span>
                </div>
                <span className="text-xs font-black text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Leer reportaje <i className="fa-solid fa-arrow-right text-[10px]"></i>
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* TENDENCIAS DE LA SEMANA (BARRA DE 3 NOTICIAS DESTACADAS ESTILO XATAKA) */}
      {selectedCategory === 'all' && (
        <section className="mb-14">
          <div className="flex items-center gap-2 mb-5">
            <i className="fa-solid fa-fire text-amber-500 text-sm"></i>
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Lo más leído esta semana
            </h3>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {trendingPosts.map((post, index) => (
              <a
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group p-4 bg-white dark:bg-[#0c1017] rounded-2xl border border-slate-200 dark:border-white/5 flex items-center gap-3.5 hover:border-primary/40 hover:shadow-md transition-all"
              >
                <span className="text-3xl font-black text-slate-300 dark:text-slate-700 group-hover:text-primary transition-colors shrink-0">
                  0{index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] uppercase font-black tracking-wider text-primary block truncate">
                    {post.category}
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                    {post.title}
                  </h4>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* FILTROS DE CATEGORÍA */}
      <div className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Todos los artículos y reportajes
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Explora nuestras guías clasificadas por temática.
            </p>
          </div>
          <span className="text-xs font-bold text-slate-400">
            {filteredPosts.length} artículos disponibles
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-primary text-white shadow-md shadow-primary/25'
                  : 'bg-slate-200/60 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {cat === 'all' ? 'Todos los temas' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* CUADRÍCULA EDITORIAL DE ARTÍCULOS (CARDS CON IMÁGENES DEDICADAS) */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filteredPosts.map(post => (
          <article 
            key={post.slug}
            className="bg-white dark:bg-[#0c1017] rounded-3xl border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col group hover:-translate-y-1" 
            onClick={() => window.location.href = `/blog/${post.slug}`}
          >
            <div className="aspect-[16/9] relative overflow-hidden bg-black">
              <img 
                src={post.image} 
                alt={post.imageAlt || post.title} 
                loading="lazy"
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <span className="absolute bottom-3 left-3 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-black/70 text-white backdrop-blur-sm border border-white/10">
                {post.category}
              </span>
            </div>

            <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="text-[11px] font-semibold text-slate-400 mb-2 flex items-center gap-2">
                  <span>{post.date}</span>
                  <span>&bull;</span>
                  <span>{post.readTime}</span>
                </div>
                <h3 className="text-base sm:text-lg font-black leading-snug group-hover:text-primary transition-colors text-slate-900 dark:text-white line-clamp-2 mb-2">
                  {post.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>

              <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs font-bold">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <i className="fa-regular fa-user text-[10px]"></i>
                  {post.author?.name || "Redacción"}
                </span>
                <span className="text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Leer reportaje <i className="fa-solid fa-arrow-right text-[10px]"></i>
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </BlogLayout>
  );
};

// COMPONENTES INDIVIDUALES PARA RETROCOMPATIBILIDAD
export const BlogPost1 = () => <BlogPostPage slug="5-trucos-ahorrar-combustible" />;
export const BlogPost2 = () => <BlogPostPage slug="gasolineras-lowcost-mito-realidad" />;
export const BlogPost3 = () => <BlogPostPage slug="mejores-apps-coche-2026" />;
export const BlogPost4 = () => <BlogPostPage slug="mantenimiento-preventivo-consumo" />;
