import React from 'react';

const PageLayout = ({ title, children }) => (
  <div className="min-h-screen bg-[#f8fafc] dark:bg-[#000000] text-slate-900 dark:text-white font-sans selection:bg-primary selection:text-white">
    <header className="px-6 py-5 border-b border-slate-200 dark:border-white/5 bg-[#f8fafc]/90 dark:bg-[#000000]/90 backdrop-blur-xl sticky top-0 z-50 flex items-center justify-between">
      <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg shadow-primary/30">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.242-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <span className="text-xl font-black tracking-tight">Way<span className="text-primary">Gass</span></span>
      </a>
      <a href="/" className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-black font-bold rounded-lg text-sm transition-transform hover:scale-105">Volver al mapa</a>
    </header>
    
    <main className="max-w-3xl mx-auto px-6 py-16">
      <div className="mb-12 border-b border-slate-200 dark:border-white/10 pb-8">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">{title}</h1>
        <p className="text-sm font-semibold text-primary uppercase tracking-widest">Última actualización: Septiembre 2026</p>
      </div>
      
      <div className="space-y-12 text-slate-700 dark:text-slate-300 leading-relaxed text-lg">
        {children}
      </div>
    </main>
    
    <footer className="py-8 px-6 border-t border-slate-200 dark:border-white/5 text-center text-sm text-slate-500 mt-12">
      <p>&copy; {new Date().getFullYear()} WayGass. Todos los derechos reservados.</p>
    </footer>
  </div>
);

const Section = ({ title, children, num }) => (
  <section className="space-y-4">
    <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-black">{num}</span>
      {title}
    </h2>
    <div className="pl-11 space-y-4">
      {children}
    </div>
  </section>
);

const List = ({ items }) => (
  <ul className="space-y-3 mt-4">
    {items.map((item, idx) => (
      <li key={idx} className="flex gap-3">
        <svg className="w-6 h-6 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

export const PrivacyPage = () => (
  <PageLayout title="Política de Privacidad">
    <Section num="1" title="Información del Responsable">
      <p>WayGass actúa como responsable del tratamiento de los datos personales recopilados a través de la plataforma web y la aplicación móvil. Nuestro compromiso es garantizar la estricta seguridad y privacidad de tus datos de acuerdo con el <strong>Reglamento General de Protección de Datos (RGPD)</strong> de la Unión Europea.</p>
    </Section>
    
    <Section num="2" title="Datos Recopilados">
      <p>Recopilamos única y exclusivamente la información básica para el funcionamiento indispensable del servicio:</p>
      <List items={[
        <><strong className="text-slate-900 dark:text-white">Datos de cuenta:</strong> Tu correo electrónico y contraseña (cifrada con los más altos estándares) en el momento de crear una cuenta.</>,
        <><strong className="text-slate-900 dark:text-white">Datos de geolocalización:</strong> Tu ubicación GPS (solo con tu permiso explícito en el navegador) para mostrarte las gasolineras más cercanas a tu posición actual. Nunca almacenamos tu historial de ubicaciones.</>,
        <><strong className="text-slate-900 dark:text-white">Datos de uso:</strong> Tus preferencias de filtrado, tipo de combustible habitual, y vehículos guardados en la sección "Mi Garaje".</>
      ]} />
    </Section>
    
    <Section num="3" title="Uso de los Datos">
      <p>Los datos que compartes con nosotros se utilizan bajo estricta confidencialidad para:</p>
      <List items={[
        "Proporcionar el servicio de mapa interactivo y cálculo de rutas.",
        "Personalizar tu experiencia (recordar tu tema oscuro o estaciones favoritas).",
        "Prevenir de forma activa los accesos no autorizados y bloqueos de seguridad."
      ]} />
    </Section>
    
    <Section num="4" title="Terceros y MITECO">
      <p>Los precios de los combustibles son públicos y se obtienen mediante sincronización en tiempo real con el portal del <strong>Ministerio para la Transición Ecológica y el Reto Demográfico (MITECO)</strong>. WayGass garantiza que nunca venderá ni compartirá tus datos personales con terceros para fines publicitarios sin tu consentimiento expreso.</p>
    </Section>
    
    <Section num="5" title="Tus Derechos">
      <p>Como usuario, tienes el derecho de ejercer el acceso, rectificación, cancelación y oposición de tus datos. Puedes contactar con nuestro equipo de soporte directamente desde tu panel de usuario o eliminar tu cuenta permanentemente (y todos los datos asociados) con un solo clic en los ajustes de tu perfil.</p>
    </Section>
  </PageLayout>
);

export const LegalPage = () => (
  <PageLayout title="Aviso Legal">
    <Section num="1" title="Condiciones Generales">
      <p>El uso de la plataforma WayGass implica la aceptación plena de estas condiciones. Esta herramienta ha sido diseñada con el objetivo de proporcionar un mapa interactivo inteligente para localizar y comparar precios de estaciones de servicio en todo el territorio español.</p>
    </Section>
    
    <Section num="2" title="Propiedad Intelectual">
      <p>El diseño de interfaz, código fuente algorítmico, logotipos y elementos gráficos de WayGass son exclusivos y están protegidos por derechos de propiedad intelectual e industrial. Queda terminantemente prohibida la extracción automatizada de datos (web scraping), reproducción o distribución de nuestra plataforma sin autorización expresa y por escrito.</p>
    </Section>
    
    <Section num="3" title="Exención de Responsabilidad">
      <p>WayGass obtiene los precios de forma automatizada desde el portal oficial de datos abiertos del MITECO. Aunque nos esforzamos diariamente por mantener un alto rigor y actualización de la información, no nos hacemos responsables de posibles discrepancias de céntimos entre el precio mostrado en la app y el precio final en el surtidor. Las estaciones de servicio tienen la potestad de modificar sus tarifas sin previo aviso o sufrir retrasos en el envío de sus datos al ministerio.</p>
      <p className="mt-4">Asimismo, WayGass es una herramienta de asistencia. No nos hacemos responsables de infracciones o daños derivados del uso de rutas sugeridas durante la conducción. Se recomienda encarecidamente fijar la ruta antes de arrancar el vehículo y respetar siempre las normas de la DGT.</p>
    </Section>
  </PageLayout>
);

export const CookiesPolicyPage = () => (
  <PageLayout title="Política de Cookies">
    <Section num="1" title="¿Qué son las cookies?">
      <p>Las cookies son pequeños archivos de texto que se descargan y guardan en el navegador de tu dispositivo móvil u ordenador al visitar WayGass. Su función principal es hacer que la web funcione correctamente de forma segura y recordar tus preferencias personales.</p>
    </Section>
    
    <Section num="2" title="Tipos de cookies que usamos">
      <p>Nuestra aplicación se basa en tres pilares fundamentales que utilizan almacenamiento local:</p>
      <List items={[
        <><strong className="text-slate-900 dark:text-white">Cookies Técnicas (Estrictamente Necesarias):</strong> Son el motor de la app. Resultan fundamentales para que puedas iniciar sesión de forma segura y cargar el mapa sin errores. Al ser esenciales, no requieren consentimiento previo legal.</>,
        <><strong className="text-slate-900 dark:text-white">Cookies de Preferencias (Local Storage):</strong> Cuidan tu experiencia. Recuerdan configuraciones como tu tipo de combustible favorito, tu provincia elegida, y si prefieres el esquema oscuro (Modo Noche). Estas se almacenan de forma privada en tu dispositivo.</>,
        <><strong className="text-slate-900 dark:text-white">Cookies de Rendimiento y Publicidad:</strong> Empleamos tecnología y cookies de socios como Google AdSense para mostrarte anuncios relevantes y poco invasivos. Son necesarias para poder mantener los servidores de WayGass operativos y ofrecerte la herramienta 100% gratis.</>
      ]} />
    </Section>
    
    <Section num="3" title="Gestión y Control de Cookies">
      <p>Tienes el control total en tus manos. Puedes aceptar, rechazar o configurar de forma granular el uso de cookies desde el banner informativo inferior que aparece al entrar por primera vez. También puedes limpiar y borrar las cookies en cualquier momento desde las herramientas de privacidad nativas de tu navegador web (Chrome, Safari, Edge, Firefox).</p>
    </Section>
  </PageLayout>
);
