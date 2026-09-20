import React from 'react';

const BlogLayout = ({ children }) => (
  <div className="min-h-screen bg-[#f8fafc] dark:bg-[#000000] text-slate-900 dark:text-white font-sans">
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
      <a href="/" className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-black font-bold rounded-lg text-sm">Ir a la App</a>
    </header>
    <main className="max-w-4xl mx-auto px-6 py-12">
      {children}
    </main>
    <footer className="py-8 px-6 border-t border-slate-200 dark:border-white/5 text-center text-sm text-slate-500 mt-20">
      <p>&copy; {new Date().getFullYear()} WayGass. Blog oficial de conducción eficiente.</p>
    </footer>
  </div>
);

export const BlogIndex = () => (
  <BlogLayout>
    <div className="mb-12 text-center">
      <h1 className="text-4xl md:text-5xl font-black mb-4">Blog de Conducción y Ahorro</h1>
      <p className="text-lg text-slate-600 dark:text-slate-400">Consejos prácticos, noticias sobre combustibles y trucos para reducir tu consumo.</p>
    </div>
    
    <div className="grid md:grid-cols-2 gap-8">
      
      <article className="bg-white dark:bg-[#0a0a0a] rounded-2xl border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm hover:shadow-xl transition-shadow cursor-pointer flex flex-col" onClick={() => window.location.href='/blog/5-trucos-ahorrar-combustible'}>
        <div className="h-48 bg-primary/20 flex items-center justify-center">
           <svg className="w-16 h-16 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
        </div>
        <div className="p-6 flex-1 flex flex-col">
          <span className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Consejos</span>
          <h2 className="text-xl font-bold mb-3">5 Trucos infalibles para ahorrar combustible en cada viaje</h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm flex-1">¿Sabías que la presión de los neumáticos o el uso del aire acondicionado pueden disparar tu consumo? Aprende cómo optimizar tu depósito.</p>
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/5 text-sm text-slate-500">20 Sept, 2026 • 3 min de lectura</div>
        </div>
      </article>

      <article className="bg-white dark:bg-[#0a0a0a] rounded-2xl border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm hover:shadow-xl transition-shadow cursor-pointer flex flex-col" onClick={() => window.location.href='/blog/gasolineras-lowcost-mito-realidad'}>
        <div className="h-48 bg-blue-500/20 flex items-center justify-center">
           <svg className="w-16 h-16 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
        </div>
        <div className="p-6 flex-1 flex flex-col">
          <span className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-2">Mecánica</span>
          <h2 className="text-xl font-bold mb-3">Gasolineras Low-Cost: ¿Mito o realidad sobre la calidad?</h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm flex-1">Desmentimos los mitos más comunes sobre las estaciones de bajo coste. ¿El diésel barato estropea el motor? Te contamos qué dice la ciencia.</p>
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/5 text-sm text-slate-500">18 Sept, 2026 • 5 min de lectura</div>
        </div>
      </article>

    </div>
  </BlogLayout>
);

export const BlogPost1 = () => (
  <BlogLayout>
    <article className="prose dark:prose-invert prose-slate prose-a:text-primary max-w-none">
      <a href="/blog" className="text-sm font-bold no-underline mb-8 inline-block hover:opacity-80">← Volver al blog</a>
      <h1 className="text-3xl md:text-5xl font-black mb-4">5 Trucos infalibles para ahorrar combustible en cada viaje</h1>
      <p className="text-slate-500">Publicado el 20 de Septiembre, 2026 por el equipo de WayGass</p>
      
      <p>El precio del combustible fluctúa constantemente, pero lo que sí puedes controlar es cómo conduces. Con unos simples ajustes en tu rutina, puedes reducir drásticamente tu consumo anual y ahorrar cientos de euros.</p>
      
      <h2>1. Mantén la presión correcta de los neumáticos</h2>
      <p>Conducir con los neumáticos desinflados aumenta la resistencia a la rodadura. Esto obliga al motor a trabajar más y consumir hasta un 3% más de combustible. Revisa la presión al menos una vez al mes y siempre antes de un viaje largo.</p>

      <h2>2. Conduce con suavidad (Eco-Driving)</h2>
      <p>Los acelerones bruscos y los frenazos repentinos son el mayor enemigo de la eficiencia. Intenta anticiparte al tráfico: levanta el pie del acelerador antes de llegar a un semáforo rojo y acelera de forma progresiva. Mantener una velocidad constante en la marcha más alta posible hace milagros por tu consumo.</p>

      <h2>3. Aire Acondicionado vs. Ventanillas bajadas</h2>
      <p>A menos de 80 km/h en ciudad, llevar las ventanillas bajadas consume menos que el aire acondicionado. Sin embargo, en autopista o autovía a más de 90 km/h, la resistencia aerodinámica que generan las ventanillas abiertas consume muchísimo más combustible que encender el climatizador.</p>

      <h2>4. El maletero no es un trastero</h2>
      <p>Cada 50 kg de peso extra incrementan el consumo en un 2%. Además, elementos como las bacas, los cofres de techo o los portabicicletas rompen la aerodinámica del vehículo. Si no los estás usando, desmóntalos.</p>

      <h2>5. Usa WayGass para comparar precios</h2>
      <p>El truco más directo: no repostes en la primera estación que veas. Usa nuestra aplicación para localizar las estaciones de servicio a tu alrededor. En una misma ruta, la diferencia de precio entre dos gasolineras a 5 minutos de distancia puede ser de hasta 20 céntimos por litro. ¡Eso son 10 euros de ahorro en un solo depósito de 50L!</p>
    </article>
  </BlogLayout>
);

export const BlogPost2 = () => (
  <BlogLayout>
    <article className="prose dark:prose-invert prose-slate prose-a:text-primary max-w-none">
      <a href="/blog" className="text-sm font-bold no-underline mb-8 inline-block hover:opacity-80">← Volver al blog</a>
      <h1 className="text-3xl md:text-5xl font-black mb-4">Gasolineras Low-Cost: ¿Mito o realidad sobre la calidad?</h1>
      <p className="text-slate-500">Publicado el 18 de Septiembre, 2026 por el equipo de WayGass</p>
      
      <p>Es el debate eterno entre conductores. Algunos juran que nunca pisarían una gasolinera "low-cost" porque creen que estropeará sus inyectores. Otros presumen de ahorrar 15 euros por depósito sin haber pisado nunca el taller. ¿Qué hay de verdad en todo esto?</p>

      <h2>La base es exactamente la misma</h2>
      <p>En España, el suministro de combustible está fuertemente regulado. Todo el carburante base que se vende en el país, ya sea en una estación premium o en un supermercado, proviene de las mismas instalaciones de la <strong>Compañía Logística de Hidrocarburos (CLH)</strong>, ahora conocida como Exolum.</p>
      <p>Por lo tanto, la "gasolina base" cumple unos estrictos estándares europeos de calidad mínima. Es imposible que te vendan combustible adulterado o sucio desde los surtidores legales.</p>

      <h2>El secreto está en los aditivos</h2>
      <p>¿Dónde está la diferencia real? En los aditivos. Las grandes marcas petroleras añaden a sus combustibles unas fórmulas patentadas (aditivos) justo antes de distribuirlos en sus estaciones.</p>
      <p>Estos aditivos están diseñados para:</p>
      <ul>
        <li>Limpiar y proteger los inyectores.</li>
        <li>Reducir la fricción interna del motor.</li>
        <li>Prevenir la corrosión y la espuma en el repostaje (muy común en el diésel).</li>
      </ul>

      <h2>¿Estropean el motor los combustibles baratos?</h2>
      <p>No. El combustible low-cost no estropea el motor a corto plazo porque cumple con las normativas europeas. Sin embargo, el uso continuado durante cientos de miles de kilómetros sin los detergentes adicionales que ofrecen los aditivos premium podría (en teoría) requerir una limpieza de inyectores antes de tiempo en motores modernos muy sofisticados.</p>

      <h2>Conclusión: ¿Merece la pena?</h2>
      <p>Para el 90% de los conductores y vehículos normales, el ahorro económico de las estaciones low-cost compensa con creces. Un consejo muy popular entre mecánicos es alternar: repostar 3 o 4 veces en low-cost, y luego un depósito de combustible premium para aprovechar el efecto de sus aditivos limpiadores. Usa el mapa de <strong>WayGass</strong> para encontrar la estación que mejor se adapte a tu bolsillo hoy.</p>
    </article>
  </BlogLayout>
);
