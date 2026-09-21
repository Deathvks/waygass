import React from 'react';

const BlogLayout = ({ children }) => (
  <div className="min-h-screen bg-[#f8fafc] dark:bg-[#000000] text-slate-900 dark:text-white font-sans selection:bg-primary selection:text-white">
    <header className="px-6 py-5 border-b border-slate-200 dark:border-white/5 bg-[#f8fafc]/90 dark:bg-[#000000]/90 backdrop-blur-xl sticky top-0 z-50 flex items-center justify-between">
      <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg shadow-primary/30">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.242-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <span className="text-xl font-black tracking-tight">Way<span className="text-primary">Gass</span> Blog</span>
      </a>
      <a href="/" className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-black font-bold rounded-lg text-sm transition-transform hover:scale-105">Ir al mapa</a>
    </header>
    <main className="max-w-4xl mx-auto px-6 py-12">
      {children}
    </main>
    <footer className="py-8 px-6 border-t border-slate-200 dark:border-white/5 text-center text-sm text-slate-500 mt-20">
      <p>&copy; {new Date().getFullYear()} WayGass. Blog oficial de conducción eficiente.</p>
    </footer>
  </div>
);

const ArticleHeading = ({ children }) => <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mt-12 mb-6 flex items-center gap-3"><span className="w-2 h-8 rounded-full bg-primary inline-block"></span>{children}</h2>;
const ArticleParagraph = ({ children }) => <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-6">{children}</p>;
const ArticleList = ({ items }) => (
  <ul className="space-y-4 my-8 pl-4 border-l-2 border-primary/20">
    {items.map((item, idx) => (
      <li key={idx} className="flex gap-3 text-lg text-slate-700 dark:text-slate-300">
        <span className="text-primary font-bold mt-1">•</span>
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

export const BlogIndex = () => (
  <BlogLayout>
    <div className="mb-16 text-center">
      <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-widest mb-4">Actualidad del motor</span>
      <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">Blog de Ahorro</h1>
      <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Consejos prácticos, noticias sobre combustibles y trucos probados para reducir tu consumo anual.</p>
    </div>
    
    <div className="grid md:grid-cols-2 gap-8">
      
      <article className="bg-white dark:bg-[#0a0a0a] rounded-3xl border border-slate-200 dark:border-white/5 overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-primary/10 transition-all cursor-pointer flex flex-col group hover:-translate-y-1" onClick={() => window.location.href='/blog/5-trucos-ahorrar-combustible'}>
        <div className="h-56 relative overflow-hidden">
          <img src="/blog-eco-driving.jpg" alt="Eco Driving" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        </div>
        <div className="p-8 flex-1 flex flex-col">
          <span className="text-xs font-black text-primary uppercase tracking-widest mb-3">Guía Práctica</span>
          <h2 className="text-2xl font-black mb-4 leading-tight group-hover:text-primary transition-colors">5 Trucos infalibles para ahorrar combustible en cada viaje</h2>
          <p className="text-slate-600 dark:text-slate-400 flex-1 leading-relaxed">¿Sabías que la presión de los neumáticos o el uso del aire acondicionado pueden disparar tu consumo? Aprende cómo optimizar tu depósito.</p>
          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-white/5 flex justify-between items-center text-sm font-bold text-slate-400">
            <span>20 Sept, 2026</span>
            <span className="text-primary flex items-center gap-1">Leer artículo <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7"/></svg></span>
          </div>
        </div>
      </article>

      <article className="bg-white dark:bg-[#0a0a0a] rounded-3xl border border-slate-200 dark:border-white/5 overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-primary/10 transition-all cursor-pointer flex flex-col group hover:-translate-y-1" onClick={() => window.location.href='/blog/gasolineras-lowcost-mito-realidad'}>
        <div className="h-56 relative overflow-hidden">
          <img src="/blog-low-cost.jpg" alt="Low Cost Gas" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        </div>
        <div className="p-8 flex-1 flex flex-col">
          <span className="text-xs font-black text-primary uppercase tracking-widest mb-3">Mecánica</span>
          <h2 className="text-2xl font-black mb-4 leading-tight group-hover:text-primary transition-colors">Gasolineras Low-Cost: ¿Mito o realidad sobre la calidad?</h2>
          <p className="text-slate-600 dark:text-slate-400 flex-1 leading-relaxed">Desmentimos los mitos más comunes sobre las estaciones de bajo coste. ¿El diésel barato estropea el motor? Te contamos qué dice la ciencia.</p>
          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-white/5 flex justify-between items-center text-sm font-bold text-slate-400">
            <span>18 Sept, 2026</span>
            <span className="text-primary flex items-center gap-1">Leer artículo <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7"/></svg></span>
          </div>
        </div>
      </article>

    
        <article className="bg-white dark:bg-[#0a0a0a] rounded-3xl border border-slate-200 dark:border-white/5 overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-primary/10 transition-all cursor-pointer flex flex-col group hover:-translate-y-1" onClick={() => window.location.href='/blog/mejores-apps-coche-2026'}>
          <div className="h-56 relative overflow-hidden">
            <img src="/blog-apps-car.jpg" alt="Apps de Coche" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          </div>
          <div className="p-8 flex-1 flex flex-col">
            <span className="text-xs font-black text-primary uppercase tracking-widest mb-3">Tecnología</span>
            <h2 className="text-2xl font-black mb-4 leading-tight group-hover:text-primary transition-colors">Las 5 mejores apps para conductores en 2026</h2>
            <p className="text-slate-600 dark:text-slate-400 flex-1 leading-relaxed">Desde comparadores de precios hasta gestión de rutas y mantenimiento. Digitaliza tu coche y exprime al máximo cada viaje.</p>
            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-white/5 flex justify-between items-center text-sm font-bold text-slate-400">
              <span>25 Sept, 2026</span>
              <span className="text-primary flex items-center gap-1">Leer artículo <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7"/></svg></span>
            </div>
          </div>
        </article>

        <article className="bg-white dark:bg-[#0a0a0a] rounded-3xl border border-slate-200 dark:border-white/5 overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-primary/10 transition-all cursor-pointer flex flex-col group hover:-translate-y-1" onClick={() => window.location.href='/blog/mantenimiento-preventivo-consumo'}>
          <div className="h-56 relative overflow-hidden">
            <img src="/blog-maintenance.jpg" alt="Mantenimiento Coche" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          </div>
          <div className="p-8 flex-1 flex flex-col">
            <span className="text-xs font-black text-primary uppercase tracking-widest mb-3">Mecánica</span>
            <h2 className="text-2xl font-black mb-4 leading-tight group-hover:text-primary transition-colors">Mantenimiento preventivo: ¿Afecta al consumo?</h2>
            <p className="text-slate-600 dark:text-slate-400 flex-1 leading-relaxed">Filtros sucios, bujías desgastadas y aceite antiguo. Descubre cuánto combustible estás perdiendo por no visitar al mecánico.</p>
            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-white/5 flex justify-between items-center text-sm font-bold text-slate-400">
              <span>28 Sept, 2026</span>
              <span className="text-primary flex items-center gap-1">Leer artículo <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7"/></svg></span>
            </div>
          </div>
        </article>
</div>
  </BlogLayout>
);

export const BlogPost1 = () => (
  <BlogLayout>
    <div className="max-w-3xl mx-auto">
      <a href="/blog" className="text-sm font-bold text-slate-500 hover:text-primary transition-colors flex items-center gap-2 mb-12">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7"/></svg>
        Volver al índice
      </a>
      
      <div className="mb-12 border-b border-slate-200 dark:border-white/10 pb-12">
        <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-widest mb-6">Guía Práctica</span>
        <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-[1.15]">5 Trucos infalibles para ahorrar combustible en cada viaje</h1>
        <div className="my-8 rounded-3xl overflow-hidden shadow-xl">
          <img src="/blog-eco-driving.jpg" alt="Eco Driving" className="w-full h-auto aspect-video object-cover" />
        </div>
        
        <div className="flex items-center gap-4 text-sm font-bold text-slate-500">
          <img src="/logo.png" alt="WayGass" className="w-10 h-10 rounded-full object-cover shadow-sm bg-white" />
          <div>
            <div className="text-slate-900 dark:text-white">Equipo Editorial de WayGass</div>
            <div>Publicado el 20 de Septiembre, 2026</div>
          </div>
        </div>
      </div>
      
      <ArticleParagraph>El precio del combustible fluctúa constantemente, pero lo que sí puedes controlar de forma inmediata es cómo conduces. Con unos simples ajustes en tu rutina diaria al volante, puedes reducir drásticamente tu consumo anual y ahorrar cientos de euros.</ArticleParagraph>
      
      <ArticleHeading>1. Mantén la presión correcta de los neumáticos</ArticleHeading>
      <ArticleParagraph>Conducir con los neumáticos desinflados aumenta severamente la resistencia a la rodadura. Esto obliga al motor a trabajar más y consumir hasta un <strong className="text-slate-900 dark:text-white">3% más de combustible</strong>. Recomendamos revisar la presión al menos una vez al mes y siempre antes de iniciar un viaje largo en carretera.</ArticleParagraph>

      <ArticleHeading>2. Conduce con suavidad (Eco-Driving)</ArticleHeading>
      <ArticleParagraph>Los acelerones bruscos y los frenazos repentinos son el mayor enemigo de la eficiencia energética de tu coche. Intenta anticiparte al tráfico: levanta el pie del acelerador antes de llegar a un semáforo rojo y acelera de forma progresiva. Mantener una velocidad constante en la marcha más alta posible (conducción a bajas revoluciones) hace milagros por tu consumo.</ArticleParagraph>

      <ArticleHeading>3. Aire Acondicionado vs. Ventanillas bajadas</ArticleHeading>
      <ArticleParagraph>A menos de 80 km/h en entornos urbanos, llevar las ventanillas bajadas consume menos que utilizar el compresor del aire acondicionado. Sin embargo, en autopista o autovía a más de 90 km/h, la enorme resistencia aerodinámica que generan las ventanillas abiertas consume muchísimo más combustible que encender el climatizador.</ArticleParagraph>

      <ArticleHeading>4. El maletero no es un trastero</ArticleHeading>
      <ArticleParagraph>Cada 50 kg de peso extra en el coche incrementan el consumo en un 2% adicional. Además, elementos exteriores como las bacas, los cofres de techo o los portabicicletas rompen el perfil aerodinámico del vehículo, causando un efecto paracaídas. Si no los estás usando activamente, desmóntalos y guárdalos en casa.</ArticleParagraph>

      <ArticleHeading>5. Usa WayGass para comparar precios</ArticleHeading>
      <ArticleParagraph>El truco más directo y efectivo de todos: <strong>no repostes en la primera estación que veas</strong>. Usa nuestra aplicación interactiva para localizar las estaciones de servicio a tu alrededor. En una misma ruta, la diferencia de precio entre dos gasolineras a 5 minutos de distancia puede ser de hasta 20 céntimos por litro. ¡Eso son 10 euros de ahorro limpio en un solo depósito de 50L!</ArticleParagraph>
    </div>
  </BlogLayout>
);

export const BlogPost2 = () => (
  <BlogLayout>
    <div className="max-w-3xl mx-auto">
      <a href="/blog" className="text-sm font-bold text-slate-500 hover:text-primary transition-colors flex items-center gap-2 mb-12">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7"/></svg>
        Volver al índice
      </a>
      
      <div className="mb-12 border-b border-slate-200 dark:border-white/10 pb-12">
        <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-widest mb-6">Mecánica</span>
        <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-[1.15]">Gasolineras Low-Cost: ¿Mito o realidad sobre la calidad?</h1>
        <div className="my-8 rounded-3xl overflow-hidden shadow-xl">
          <img src="/blog-low-cost.jpg" alt="Low Cost Gas" className="w-full h-auto aspect-video object-cover" />
        </div>
        
        <div className="flex items-center gap-4 text-sm font-bold text-slate-500">
          <img src="/logo.png" alt="WayGass" className="w-10 h-10 rounded-full object-cover shadow-sm bg-white" />
          <div>
            <div className="text-slate-900 dark:text-white">Equipo Editorial de WayGass</div>
            <div>Publicado el 18 de Septiembre, 2026</div>
          </div>
        </div>
      </div>
      
      <ArticleParagraph>Es el debate eterno entre conductores. Algunos puristas de la mecánica juran que nunca pisarían una gasolinera "low-cost" porque aseguran que estropeará sus inyectores de alta presión. Otros, por el contrario, presumen de ahorrar más de 15 euros por depósito ininterrumpidamente durante años sin haber pisado nunca el taller. ¿Qué hay de verdad y de mito en todo esto?</ArticleParagraph>

      <ArticleHeading>La base de hidrocarburo es exactamente la misma</ArticleHeading>
      <ArticleParagraph>En España, el suministro y distribución de combustible está fuertemente regulado por el estado. Todo el carburante base que se vende en el país, ya sea en una estación premium de bandera (Repsol, Cepsa, BP) o en una estación fantasma de un supermercado, proviene de las mismas instalaciones logísticas de la <strong>Compañía Logística de Hidrocarburos (CLH)</strong>, operada actualmente bajo el nombre de Exolum.</ArticleParagraph>
      <ArticleParagraph>Por lo tanto, la "gasolina base" cumple sí o sí con unos estrictos estándares europeos de calidad mínima (EN 228 para gasolina y EN 590 para diésel). Es virtualmente imposible que te vendan combustible adulterado, aguado o "sucio" desde los surtidores legales y auditados de nuestro país.</ArticleParagraph>

      <ArticleHeading>El gran secreto reside en los aditivos</ArticleHeading>
      <ArticleParagraph>¿Dónde está entonces la diferencia real de precio? La clave está en los aditivos químicos. Las grandes marcas petroleras compran la gasolina base a CLH, pero antes de llenar las cisternas de sus camiones, inyectan al carburante unas complejas fórmulas químicas patentadas conocidas como aditivos.</ArticleParagraph>
      <ArticleParagraph>Estos aditivos, producto de años de investigación, están diseñados específicamente para:</ArticleParagraph>
      <ArticleList items={[
        "Limpiar de carbonilla y proteger los inyectores del motor a lo largo del tiempo.",
        "Reducir la fricción interna de los cilindros, prolongando la vida del aceite.",
        "Prevenir la corrosión del depósito y evitar la molesta espuma en el repostaje (un problema muy común en el diésel)."
      ]} />

      <ArticleHeading>¿Estropean el motor los combustibles baratos?</ArticleHeading>
      <ArticleParagraph><strong className="text-slate-900 dark:text-white">Rotundamente No.</strong> El combustible low-cost de supermercado o estaciones independientes no estropeará tu motor a corto ni a medio plazo, ya que repetimos, cumple rigurosamente con todas las normativas de pureza europeas.</ArticleParagraph>
      <ArticleParagraph>Sin embargo, el uso exclusivo y continuado durante cientos de miles de kilómetros sin los detergentes adicionales que ofrecen los aditivos premium podría requerir una limpieza mecánica de inyectores o de la válvula EGR antes de tiempo en motores modernos muy sofisticados (especialmente diésel modernos con filtros DPF delicados).</ArticleParagraph>

      <ArticleHeading>Conclusión y veredicto: ¿Merece la pena?</ArticleHeading>
      <ArticleParagraph>Para el 90% de los conductores y los vehículos de uso diario, el inmenso ahorro económico que suponen las estaciones low-cost compensa con creces cualquier duda mecánica. Un consejo muy popular y sabio entre mecánicos profesionales es la <strong>alternancia estratégica</strong>: reposta 3 o 4 veces seguidas en estaciones low-cost, y luego dedica un depósito completo de combustible premium para aprovechar el efecto "limpiador" de sus aditivos.</ArticleParagraph>
      <ArticleParagraph>Sea cual sea tu estrategia, usa el mapa inteligente de <strong>WayGass</strong> para encontrar la estación que mejor se adapte a tu bolsillo en este mismo momento.</ArticleParagraph>
    </div>
  </BlogLayout>
);

export const BlogPost3 = () => (
  <BlogLayout>
    <div className="max-w-3xl mx-auto">
      <a href="/blog" className="text-sm font-bold text-slate-500 hover:text-primary transition-colors flex items-center gap-2 mb-12">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7"/></svg>
        Volver al índice
      </a>
      
      <div className="mb-12 border-b border-slate-200 dark:border-white/10 pb-12">
        <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-widest mb-6">Tecnología</span>
        <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-[1.15]">Las 5 mejores apps para conductores en 2026</h1>
        <div className="my-8 rounded-3xl overflow-hidden shadow-xl">
          <img src="/blog-apps-car.jpg" alt="Apps de Coche" className="w-full h-auto aspect-video object-cover" />
        </div>
        
        <div className="flex items-center gap-4 text-sm font-bold text-slate-500">
          <img src="/logo.png" alt="WayGass" className="w-10 h-10 rounded-full object-cover shadow-sm bg-white" />
          <div>
            <div className="text-slate-900 dark:text-white">Equipo Editorial de WayGass</div>
            <div>Publicado el 25 de Septiembre, 2026</div>
          </div>
        </div>
      </div>

      <div className="prose prose-slate dark:prose-invert max-w-none prose-lg">
        <ArticleParagraph>La digitalización ha llegado para quedarse en el mundo del motor. Hoy en día, nuestro smartphone es el mejor copiloto que podemos tener, ofreciendo funcionalidades que hace una década parecían ciencia ficción. Aquí te traemos el Top 5 definitivo de este año.</ArticleParagraph>
        
        <ArticleHeading>1. WayGass: Tu aliado para el ahorro</ArticleHeading>
        <ArticleParagraph>No podíamos empezar la lista sin mencionar nuestra propia herramienta. Con alertas de bajadas de precio, integración con sistemas de infoentretenimiento, temas personalizados y un mapa hiperdetallado, WayGass se ha coronado como la app de ahorro líder en el sector del repostaje. ¡Imprescindible para cualquier conductor frecuente!</ArticleParagraph>
        
        <ArticleHeading>2. Waze: Navegación predictiva y social</ArticleHeading>
        <ArticleParagraph>Evitar atascos no solo te ahorra tiempo, sino también mucho dinero en ralentí. Waze sigue imbatible a la hora de redirigirte por calles secundarias para evitar bloqueos kilométricos, avisarte de radares y de vehículos parados en el arcén gracias a su inmensa comunidad de usuarios.</ArticleParagraph>

        <ArticleHeading>3. Drivvo: Gestión total del vehículo</ArticleHeading>
        <ArticleParagraph>Si eres un maniático del control, Drivvo es para ti. Te permite llevar un registro exhaustivo de tus repostajes, gastos de peajes, mantenimientos y recordatorios de la ITV o el seguro. Al final de mes, puedes generar gráficos detallados para saber exactamente cuánto te cuesta mantener tu coche.</ArticleParagraph>

        <ArticleHeading>4. Telpark / ElParking: Olvídate de los parquímetros</ArticleHeading>
        <ArticleParagraph>Buscar calderilla para pagar la zona azul es cosa del pasado. Estas aplicaciones te permiten pagar el estacionamiento regulado directamente desde el móvil, ampliar el tiempo a distancia o incluso entrar y salir de parkings subterráneos usando lectura automática de matrícula sin tener que sacar un ticket de papel.</ArticleParagraph>

        <ArticleHeading>5. Spotify: La banda sonora de tus viajes</ArticleHeading>
        <ArticleParagraph>Aunque parezca obvia, las últimas actualizaciones de Spotify diseñadas específicamente para el "Car Mode" la hacen indispensable. Con controles simplificados por voz, integración perfecta con Android Auto y Apple CarPlay, y podcasts dedicados al motor, transforma cualquier viaje aburrido en una experiencia placentera.</ArticleParagraph>
      </div>
    </div>
  </BlogLayout>
);

export const BlogPost4 = () => (
  <BlogLayout>
    <div className="max-w-3xl mx-auto">
      <a href="/blog" className="text-sm font-bold text-slate-500 hover:text-primary transition-colors flex items-center gap-2 mb-12">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7"/></svg>
        Volver al índice
      </a>
      
      <div className="mb-12 border-b border-slate-200 dark:border-white/10 pb-12">
        <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-widest mb-6">Mecánica</span>
        <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-[1.15]">Mantenimiento preventivo: ¿Afecta al consumo?</h1>
        <div className="my-8 rounded-3xl overflow-hidden shadow-xl">
          <img src="/blog-maintenance.jpg" alt="Mantenimiento Coche" className="w-full h-auto aspect-video object-cover" />
        </div>
        
        <div className="flex items-center gap-4 text-sm font-bold text-slate-500">
          <img src="/logo.png" alt="WayGass" className="w-10 h-10 rounded-full object-cover shadow-sm bg-white" />
          <div>
            <div className="text-slate-900 dark:text-white">Equipo Editorial de WayGass</div>
            <div>Publicado el 28 de Septiembre, 2026</div>
          </div>
        </div>
      </div>

      <div className="prose prose-slate dark:prose-invert max-w-none prose-lg">
        <ArticleParagraph>Muchos conductores retrasan las revisiones mecánicas pensando que así ahorran dinero a corto plazo, pero la realidad es muy distinta. Un coche descuidado consume mucho más y acabará pasándote una factura mayor en el surtidor o en averías graves. Te explicamos los factores clave.</ArticleParagraph>
        
        <ArticleHeading>Filtros de aire sucios</ArticleHeading>
        <ArticleParagraph>El motor necesita respirar para quemar la gasolina. Si el filtro está obstruido por polvo o insectos, la mezcla de oxígeno y combustible se desequilibra, forzando a la centralita a inyectar más gasolina para compensar la falta de aire. Cambiar un filtro cuesta apenas 15€ y se paga solo en ahorro de combustible.</ArticleParagraph>
        
        <ArticleHeading>Bujías en mal estado</ArticleHeading>
        <ArticleParagraph>Una chispa débil significa que el combustible no se quema de forma eficiente dentro del cilindro, provocando tirones y pérdida de potencia. Sustituir las bujías a tiempo puede devolverle a tu coche la eficiencia del primer día y reducir tu gasto mensual notablemente.</ArticleParagraph>

        <ArticleHeading>Aceite de motor degradado</ArticleHeading>
        <ArticleParagraph>El aceite viejo pierde su viscosidad y capacidad de lubricación. Esto aumenta drásticamente la fricción interna de los componentes móviles del motor, lo que significa que el motor tiene que hacer más esfuerzo (y quemar más gasolina) simplemente para mantener el coche en movimiento. Usa siempre el aceite sintético recomendado por el fabricante.</ArticleParagraph>

        <ArticleHeading>Neumáticos desalineados</ArticleHeading>
        <ArticleParagraph>Si tu coche tiende a irse hacia un lado cuando sueltas el volante, tienes un problema de alineación. Esto no solo destroza las gomas de forma irregular, sino que obliga al vehículo a vencer una resistencia constante contra el asfalto, disparando el consumo hasta un 5%.</ArticleParagraph>

        <ArticleHeading>La sonda lambda y los sensores</ArticleHeading>
        <ArticleParagraph>La sonda lambda se encarga de medir el oxígeno en los gases de escape. Si falla o está sucia, enviará datos erróneos a la centralita, que por precaución ordenará inyectar más combustible del necesario (modo rico). Un simple escaneo OBD2 en tu taller de confianza puede detectar este fallo silencioso que vacía tu cartera.</ArticleParagraph>
      </div>
    </div>
  </BlogLayout>
);
