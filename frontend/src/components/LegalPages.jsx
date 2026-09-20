import React from 'react';

const PageLayout = ({ title, children }) => (
  <div className="min-h-screen bg-[#f8fafc] dark:bg-[#000000] text-slate-900 dark:text-white font-sans">
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
      <a href="/" className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-black font-bold rounded-lg text-sm">Volver al mapa</a>
    </header>
    <main className="max-w-3xl mx-auto px-6 py-12 prose dark:prose-invert prose-slate prose-a:text-primary">
      <h1 className="text-4xl font-black mb-8">{title}</h1>
      {children}
    </main>
  </div>
);

export const PrivacyPage = () => (
  <PageLayout title="Política de Privacidad">
    <p>Última actualización: Septiembre 2026</p>
    <h2>1. Información del Responsable</h2>
    <p>WayGass actúa como responsable del tratamiento de los datos personales recopilados a través de la plataforma web y la aplicación móvil. Nuestro compromiso es garantizar la seguridad y privacidad de tus datos de acuerdo con el Reglamento General de Protección de Datos (RGPD).</p>
    <h2>2. Datos Recopilados</h2>
    <p>Recopilamos información básica para el funcionamiento del servicio:</p>
    <ul>
      <li><strong>Datos de cuenta:</strong> Correo electrónico y contraseña (cifrada) al crear una cuenta.</li>
      <li><strong>Datos de geolocalización:</strong> Tu ubicación GPS (solo con tu permiso explícito en el navegador) para mostrar gasolineras cercanas. No almacenamos tu historial de ubicaciones.</li>
      <li><strong>Datos de uso:</strong> Preferencias de filtrado, tipo de combustible habitual, y vehículos guardados en "Mi Garaje".</li>
    </ul>
    <h2>3. Uso de los Datos</h2>
    <p>Los datos recopilados se utilizan exclusivamente para:</p>
    <ul>
      <li>Proporcionar el servicio de mapa interactivo y cálculo de rutas.</li>
      <li>Personalizar tu experiencia (guardar tus gasolineras favoritas).</li>
      <li>Prevenir accesos no autorizados y bloqueos de seguridad.</li>
    </ul>
    <h2>4. Terceros y MITECO</h2>
    <p>Los precios de los combustibles son públicos y se obtienen del Ministerio para la Transición Ecológica y el Reto Demográfico (MITECO). WayGass no comparte tus datos personales con terceros para fines publicitarios sin tu consentimiento.</p>
    <h2>5. Tus Derechos</h2>
    <p>Puedes ejercer tus derechos de acceso, rectificación, cancelación y oposición contactando con nuestro soporte desde el panel de administración. También puedes eliminar tu cuenta y todos tus datos asociados en cualquier momento desde los ajustes de tu perfil.</p>
  </PageLayout>
);

export const LegalPage = () => (
  <PageLayout title="Aviso Legal">
    <p>Última actualización: Septiembre 2026</p>
    <h2>1. Condiciones Generales</h2>
    <p>El uso de la plataforma WayGass implica la aceptación de estas condiciones. La herramienta proporciona un mapa interactivo para localizar y comparar precios de estaciones de servicio en España.</p>
    <h2>2. Propiedad Intelectual</h2>
    <p>El diseño, código fuente, logotipos y gráficos de WayGass están protegidos por derechos de propiedad intelectual. La extracción automatizada de datos (scraping) de nuestra plataforma está terminantemente prohibida sin autorización expresa.</p>
    <h2>3. Exención de Responsabilidad</h2>
    <p>WayGass obtiene los precios directamente del portal oficial de datos abiertos del MITECO. Aunque nos esforzamos por mantener la información actualizada, no nos hacemos responsables de posibles discrepancias entre el precio mostrado en la app y el precio real en el surtidor, ya que las gasolineras pueden modificar sus tarifas sin previo aviso o retrasarse en su reporte al ministerio.</p>
    <p>WayGass no se hace responsable de daños o perjuicios derivados del uso de rutas sugeridas. Se recomienda usar siempre el sentido común y respetar las normas de tráfico.</p>
  </PageLayout>
);

export const CookiesPolicyPage = () => (
  <PageLayout title="Política de Cookies">
    <p>Última actualización: Septiembre 2026</p>
    <h2>1. ¿Qué son las cookies?</h2>
    <p>Las cookies son pequeños archivos de texto que se guardan en tu navegador cuando visitas WayGass. Ayudan a que la web funcione correctamente y a recordar tus preferencias (como el tema oscuro o tus filtros habituales).</p>
    <h2>2. Tipos de cookies que usamos</h2>
    <ul>
      <li><strong>Cookies Técnicas (Estrictamente Necesarias):</strong> Son fundamentales para que puedas iniciar sesión de forma segura y usar las funciones básicas del mapa. No requieren consentimiento previo.</li>
      <li><strong>Cookies de Preferencias:</strong> Recuerdan configuraciones como tu tipo de combustible favorito, tu provincia, o el esquema de colores de la app. Estas se almacenan localmente (Local Storage).</li>
      <li><strong>Cookies de Rendimiento / Publicidad:</strong> Empleamos cookies de Google AdSense para mostrar anuncios relevantes que ayudan a mantener el servicio gratuito. Puedes rechazar estas cookies desde el banner inicial.</li>
    </ul>
    <h2>3. Gestión de Cookies</h2>
    <p>Puedes aceptar, rechazar o configurar las cookies desde el banner inferior cuando entras por primera vez. También puedes borrar las cookies en cualquier momento desde la configuración de privacidad de tu navegador web (Chrome, Firefox, Safari, Edge).</p>
  </PageLayout>
);
