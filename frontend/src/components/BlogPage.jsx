import React, { useState } from 'react';
import SEOHead from './SEOHead.jsx';
import { BLOG_POSTS, getBlogPostBySlug } from '../data/blogData.js';

const BlogLayout = ({ children }) => (
  <div className="min-h-screen bg-[#f8fafc] dark:bg-[#000000] text-slate-900 dark:text-white font-sans selection:bg-primary selection:text-white">
    <header className="px-6 py-5 border-b border-slate-200 dark:border-white/5 bg-[#f8fafc]/90 dark:bg-[#000000]/90 backdrop-blur-xl sticky top-0 z-50 flex items-center justify-between">
      <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg shadow-primary/30">
          <i className="fa-solid fa-gas-pump text-white text-sm"></i>
        </div>
        <span className="text-xl font-black tracking-tight">Way<span className="text-primary">Gass</span> Blog</span>
      </a>
      <div className="flex items-center gap-3">
        <a href="/gasolineras" className="hidden sm:inline text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">Provincias</a>
        <a href="/" className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-black font-bold rounded-lg text-sm transition-transform hover:scale-105">Ir al mapa</a>
      </div>
    </header>
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      {children}
    </main>
    <footer className="py-8 px-6 border-t border-slate-200 dark:border-white/5 text-center text-sm text-slate-500 mt-20">
      <p>&copy; {new Date().getFullYear()} WayGass. Blog oficial de ahorro y conducción eficiente en España.</p>
      <div className="flex flex-wrap items-center justify-center gap-4 mt-3 text-xs">
        <a href="/" className="hover:text-primary transition-colors">Inicio</a>
        <a href="/gasolineras" className="hover:text-primary transition-colors">Gasolineras por Provincia</a>
        <a href="/blog" className="hover:text-primary transition-colors">Blog</a>
        <a href="/legal" className="hover:text-primary transition-colors">Aviso Legal</a>
        <a href="/privacidad" className="hover:text-primary transition-colors">Privacidad</a>
        <a href="/cookies" className="hover:text-primary transition-colors">Cookies</a>
      </div>
    </footer>
  </div>
);

const KeyTakeawaysBox = ({ points }) => (
  <aside aria-label="Puntos clave del artículo" className="my-8 p-6 rounded-2xl bg-primary/5 dark:bg-primary/10 border border-primary/20 backdrop-blur-sm">
    <div className="flex items-center gap-2 mb-3 text-primary font-black text-sm uppercase tracking-wider">
      <i className="fa-solid fa-bolt"></i>
      <span>Puntos clave en 30 segundos</span>
    </div>
    <ul className="space-y-2.5">
      {points.map((pt, idx) => (
        <li key={idx} className="flex items-start gap-2.5 text-sm md:text-base text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
          <i className="fa-solid fa-check text-primary mt-1 text-xs shrink-0"></i>
          <span>{pt}</span>
        </li>
      ))}
    </ul>
  </aside>
);

const InArticleCta = () => (
  <aside aria-label="Herramienta de ahorro" className="my-12 p-8 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 dark:from-white/10 dark:to-white/5 border border-white/10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
    <div className="space-y-2 text-center md:text-left">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-black uppercase tracking-wider">
        <i className="fa-solid fa-gas-pump"></i> Ahorro inmediato
      </div>
      <h3 className="text-xl md:text-2xl font-black">¿Buscas la gasolina más barata ahora mismo?</h3>
      <p className="text-slate-300 text-sm max-w-md">Consulta en el mapa interactivo de WayGass los precios actualizados por el Ministerio cada hora.</p>
    </div>
    <a 
      href="/" 
      className="px-6 py-3.5 bg-primary hover:bg-primary-dark text-white font-black rounded-xl text-sm transition-transform hover:scale-105 shadow-lg shadow-primary/30 shrink-0 flex items-center gap-2 cursor-pointer"
    >
      <span>Ver mapa en tiempo real</span>
      <i className="fa-solid fa-arrow-right text-xs"></i>
    </a>
  </aside>
);

const ShareBar = ({ title, url }) => {
  const [copied, setCopied] = useState(false);
  const currentUrl = url || (typeof window !== "undefined" ? window.location.href : "https://waygass.es/blog");

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-wrap items-center gap-3 my-6 py-4 border-y border-slate-200 dark:border-white/10 text-xs font-bold text-slate-500">
      <span>Compartir artículo:</span>
      <button 
        type="button"
        onClick={handleCopy}
        className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer"
      >
        <i className={copied ? "fa-solid fa-check text-emerald-500" : "fa-solid fa-link"}></i>
        <span>{copied ? "¡Enlace copiado!" : "Copiar enlace"}</span>
      </button>
      <a 
        href={`https://wa.me/?text=${encodeURIComponent(title + " " + currentUrl)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="px-3 py-1.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 transition-colors flex items-center gap-1.5 cursor-pointer"
      >
        <i className="fa-brands fa-whatsapp text-sm"></i>
        <span>WhatsApp</span>
      </a>
      <a 
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(currentUrl)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="px-3 py-1.5 rounded-full bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 transition-colors flex items-center gap-1.5 cursor-pointer"
      >
        <i className="fa-brands fa-x-twitter text-sm"></i>
        <span>X / Twitter</span>
      </a>
    </div>
  );
};

const Breadcrumbs = ({ currentTitle }) => (
  <nav aria-label="Miga de pan" className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-8 overflow-hidden text-ellipsis whitespace-nowrap">
    <a href="/" className="hover:text-primary transition-colors flex items-center gap-1">
      <i className="fa-solid fa-house text-[10px]"></i>
      <span>Inicio</span>
    </a>
    <span>/</span>
    <a href="/blog" className="hover:text-primary transition-colors">Blog</a>
    <span>/</span>
    <span className="text-slate-700 dark:text-slate-300 truncate font-semibold">{currentTitle}</span>
  </nav>
);

const RelatedArticles = ({ currentSlug }) => {
  const related = BLOG_POSTS.filter(p => p.slug !== currentSlug).slice(0, 2);

  return (
    <div className="mt-16 pt-12 border-t border-slate-200 dark:border-white/10">
      <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2">
        <i className="fa-solid fa-newspaper text-primary text-base"></i>
        <span>Artículos recomendados</span>
      </h3>
      <div className="grid sm:grid-cols-2 gap-6">
        {related.map(p => (
          <a
            key={p.slug}
            href={`/blog/${p.slug}`}
            className="group block bg-white dark:bg-[#0a0a0a] rounded-2xl border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm hover:shadow-lg transition-all"
          >
            <div className="h-44 overflow-hidden">
              <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-5">
              <span className="text-[10px] font-black text-primary uppercase tracking-widest">{p.category}</span>
              <h4 className="font-bold text-sm text-slate-800 dark:text-white mt-1 group-hover:text-primary transition-colors line-clamp-2">
                {p.title}
              </h4>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export const BlogPostPage = ({ slug }) => {
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return (
      <BlogLayout>
        <div className="text-center py-20 space-y-4">
          <h1 className="text-3xl font-black">Artículo no encontrado</h1>
          <p className="text-slate-500">El artículo solicitado no existe o ha sido modificado.</p>
          <a href="/blog" className="inline-block px-6 py-3 bg-primary text-white font-bold rounded-xl hover:scale-105 transition-transform">
            Volver al Blog
          </a>
        </div>
      </BlogLayout>
    );
  }

  const canonicalUrl = `https://waygass.es/blog/${post.slug}`;

  return (
    <BlogLayout>
      <SEOHead 
        title={`${post.title} | WayGass`}
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
        <Breadcrumbs currentTitle={post.title} />

        <div className="mb-4 flex items-center justify-between flex-wrap gap-2">
          <span className="text-xs font-black text-primary uppercase tracking-widest">{post.category}</span>
          <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
            <span><i className="fa-regular fa-calendar mr-1"></i>{post.date}</span>
            <span><i className="fa-regular fa-clock mr-1"></i>{post.readTime}</span>
          </div>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black mb-6 tracking-tight leading-[1.15] text-slate-900 dark:text-white">
          {post.title}
        </h1>

        <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-6 font-medium">
          {post.excerpt}
        </p>

        <ShareBar title={post.title} url={canonicalUrl} />

        <div className="my-8 rounded-3xl overflow-hidden shadow-2xl">
          <img 
            src={post.image} 
            alt={post.imageAlt || post.title} 
            width="1200" 
            height="675" 
            className="w-full h-auto object-cover max-h-[440px]" 
          />
        </div>

        {post.keyPoints && post.keyPoints.length > 0 && (
          <KeyTakeawaysBox points={post.keyPoints} />
        )}

        <div className="space-y-8 mt-10">
          {post.sections.map((section, idx) => (
            <div key={idx} className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                <span className="w-2 h-7 rounded-full bg-primary inline-block"></span>
                <span>{section.heading}</span>
              </h2>
              {section.paragraphs.map((para, pIdx) => (
                <p key={pIdx} className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                  {para}
                </p>
              ))}
            </div>
          ))}
        </div>

        <InArticleCta />

        <ShareBar title={post.title} url={canonicalUrl} />

        <RelatedArticles currentSlug={post.slug} />
      </article>
    </BlogLayout>
  );
};

export const BlogIndex = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'Ahorro Inteligente', 'Mecánica', 'Consejos de Viaje', 'Mantenimiento', 'Guía Práctica', 'Tecnología', 'Movilidad Ecológica'];

  const filteredPosts = selectedCategory === 'all'
    ? BLOG_POSTS
    : BLOG_POSTS.filter(p => p.category === selectedCategory);

  return (
    <BlogLayout>
      <SEOHead 
        title="Blog de Ahorro y Combustible | Guías y Consejos WayGass"
        description="Consejos prácticos, guías de conducción eficiente, análisis de gasolineras low-cost y trucos probados para reducir tu consumo de gasolina o diésel en España."
        canonical="https://waygass.es/blog"
        breadcrumbs={[
          { name: "Inicio", url: "https://waygass.es/" },
          { name: "Blog", url: "https://waygass.es/blog" }
        ]}
      />
      <div className="mb-12 text-center space-y-4">
        <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-widest">
          Actualidad y Guías del Motor
        </span>
        <h1 className="text-3xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white">
          Blog de Ahorro y Combustible
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Consejos prácticos, análisis de precios y guías mecánicas para gastar menos dinero en cada visita a la gasolinera.
        </p>

        {/* CATEGORY FILTER PILLS */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-primary text-white shadow-sm shadow-primary/30'
                  : 'bg-slate-200/60 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {cat === 'all' ? 'Todos los artículos' : cat}
            </button>
          ))}
        </div>
      </div>
      
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map(post => (
          <article 
            key={post.slug}
            className="bg-white dark:bg-[#0a0a0a] rounded-3xl border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col group hover:-translate-y-1" 
            onClick={() => window.location.href = `/blog/${post.slug}`}
          >
            <div className="h-48 relative overflow-hidden">
              <img 
                src={post.image} 
                alt={post.imageAlt || post.title} 
                width="1200"
                height="675"
                loading="lazy"
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              <span className="absolute bottom-3 left-3 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-black/60 text-white backdrop-blur-sm">
                {post.category}
              </span>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <div className="text-[11px] font-semibold text-slate-400 mb-2 flex items-center gap-2">
                  <span>{post.date}</span>
                  <span>&bull;</span>
                  <span>{post.readTime}</span>
                </div>
                <h2 className="text-lg font-black leading-snug group-hover:text-primary transition-colors text-slate-900 dark:text-white line-clamp-2 mb-2">
                  {post.title}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs font-bold text-primary">
                <span>Leer artículo</span>
                <i className="fa-solid fa-arrow-right text-[10px] group-hover:translate-x-1 transition-transform"></i>
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
