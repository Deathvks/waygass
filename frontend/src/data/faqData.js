// ==============================================================================
// WAYGASS - PREGUNTAS FRECUENTES (FAQ) & METODOLOGÍA OFICIAL
// Optimizado para SEO, Generative Engine Optimization (GEO) y Schema FAQPage
// ==============================================================================

export const FAQ_DATA = [
  {
    id: 'que-es-waygass',
    category: 'General',
    question: '¿Qué es WayGass y cuál es su objetivo principal?',
    answerText: 'WayGass es una plataforma tecnológica e independiente de monitorización y comparación de precios de carburantes en tiempo real para España. Nuestro objetivo fundamental es empoderar a conductores particulares y profesionales del transporte para que tomen decisiones de repostaje informadas, ahorrando entre 10€ y 25€ por depósito mediante datos 100% oficiales y transparentes, sin favoritismos ni intermediación comercial.',
    highlight: 'Ahorro medio de 10€ a 25€ por depósito con datos imparciales.'
  },
  {
    id: 'fuente-datos',
    category: 'Datos y Fuentes',
    question: '¿De dónde obtiene WayGass los precios de los carburantes?',
    answerText: 'Todos los precios mostrados en WayGass proceden de la base de datos oficial del Ministerio para la Transición Ecológica y el Reto Demográfico (MITECO) del Gobierno de España. Conforme a la Orden ITC/2308/2007 y las resoluciones de la Dirección General de Política Energética y Minas, todas las estaciones de servicio que operan legalmente en España están obligadas por ley a comunicar telemáticamente sus tarifas vigentes en cuanto se produce cualquier modificación.',
    highlight: 'Datos 100% gubernamentales amparados por la Orden ITC/2308/2007.'
  },
  {
    id: 'frecuencia-actualizacion',
    category: 'Datos y Fuentes',
    question: '¿Con qué frecuencia se actualizan las tarifas en la plataforma?',
    answerText: 'WayGass sincroniza la información de MITECO de manera automatizada y continua cada 30 minutos a lo largo del día. Dado que las compañías petroleras suelen enviar cambios de precios durante la madrugada y a primera hora de la mañana, nuestro motor de datos actualiza el mapa y los rankings provinciales para reflejar el precio exacto que encontrarás en el surtidor en ese instante.',
    highlight: 'Sincronización continua cada 30 minutos los 365 días del año.'
  },
  {
    id: 'gasolineras-low-cost-fiabilidad',
    category: 'Combustible y Mecánica',
    question: '¿Son seguras las gasolineras low-cost o pueden dañar el motor de mi coche?',
    answerText: 'Son completamente seguras y fiables. En España, todo el combustible comercializado —tanto en marcas tradicionales como en estaciones automáticas low-cost— proviene de los mismos centros logísticos y refinerías autorizados, operados mayoritariamente por Exolum (antigua CLH). Por ley, todo el carburante debe superar rigurosos controles de pureza y cumplir las normativas europeas UNE-EN 228 (para gasolinas) y UNE-EN 590 (para gasóleos). La rebaja en el precio se debe a la optimización de costes (estaciones desatendidas sin personal ni tienda) y menores márgenes, no a una menor calidad del carburante.',
    highlight: 'Cumplen al 100% las normativas europeas UNE-EN 228 y UNE-EN 590.'
  },
  {
    id: 'diferencia-aditivos',
    category: 'Combustible y Mecánica',
    question: '¿Qué diferencia hay entre los aditivos de las grandes marcas y las low-cost?',
    answerText: 'El carburante base distribuido por Exolum ya incorpora los aditivos estándar obligatorios por la normativa española. Las petroleras tradicionales (Repsol, Cepsa/Moeve, BP, Shell) añaden en sus camiones cisterna formulaciones propietarias con detergentes extra, mejoradores de cetano/octano y anticorrosivos diseñados para reducir depósitos en inyectores a largo plazo. Las gasolineras low-cost utilizan el combustible con el paquete oficial o incorporan aditivos certificados de alta gama de proveedores especializados (como HQM). Ambos son perfectamente válidos y seguros para cualquier motor moderno.',
    highlight: 'El combustible base en España ya incluye aditivos oficiales de protección.'
  },
  {
    id: 'independencia-comisiones',
    category: 'Transparencia',
    question: '¿WayGass cobra comisiones a las gasolineras o favorece a marcas patrocinadas?',
    answerText: 'Rotundamente no. WayGass es un servicio 100% independiente y neutral. Ninguna estación de servicio, franquicia o petrolera puede pagar para mejorar su posicionamiento en el mapa, en los resultados de búsqueda o en los rankings provinciales. Los resultados se ordenan estrictamente por precio real comunicado y proximidad kilométrica calculada.',
    highlight: 'Cero comisiones, cero patrocinadores ocultos, imparcialidad matemática.'
  },
  {
    id: 'calculo-ahorro-garaje',
    category: 'Funcionalidades',
    question: '¿Cómo calcula WayGass el coste y el ahorro estimado de llenado?',
    answerText: 'En nuestra función "Mi Garaje", el usuario puede registrar su vehículo y la capacidad exacta de su depósito (por ejemplo, 50 litros). WayGass calcula el importe multiplicando los litros por el precio de la estación seleccionada y lo compara en tiempo real con la gasolinera más cara de la zona y con la media provincial, mostrándote el ahorro neto exacto en euros que te embolsas en un solo repostaje.',
    highlight: 'Cálculo a medida según los litros reales del depósito de tu vehículo.'
  },
  {
    id: 'combustibles-disponibles',
    category: 'Funcionalidades',
    question: '¿Qué tipos de combustible se pueden consultar y comparar en WayGass?',
    answerText: 'WayGass permite monitorizar en tiempo real todas las variantes oficiales comercializadas en España: Gasolina 95 E5 y E10, Gasolina 98 E5, Gasóleo A habitual (Diésel), Gasóleo Premium (Diésel Plus), Gasóleo B (agrícola y pesquero), GLP (Autogás / Gases Licuados del Petróleo), GNC (Gas Natural Comprimido), GNL (Gas Natural Licuado) e Hidrógeno.',
    highlight: 'Soporte completo para Gasolina 95/98, Diésel, Diésel Plus, GLP y GNC.'
  },
  {
    id: 'privacidad-gps',
    category: 'Privacidad y Seguridad',
    question: '¿Cómo protege WayGass la privacidad de mi ubicación GPS?',
    answerText: 'Tu ubicación geográfica se procesa de manera estrictamente local y efímera en tu propio navegador mediante la API de Geolocalización de HTML5. WayGass no almacena tu historial de rutas, no crea perfiles de movilidad y nunca vende ni cede coordenadas a terceros ni a redes publicitarias.',
    highlight: 'Geolocalización procesada en tu dispositivo sin almacenamiento de rutas.'
  },
  {
    id: 'diferencias-precio-ciudades',
    category: 'Mercado Energético',
    question: '¿Por qué varían tanto los precios del combustible entre provincias y ciudades?',
    answerText: 'El precio final del combustible en surtidor está condicionado por múltiples factores: el coste logístico de transporte desde los oleoductos y puertos de Exolum hasta cada provincia, el precio del suelo y alquiler de la estación, los costes laborales de estaciones atendidas versus automáticas, el nivel de competencia local y las promociones comerciales de cada operador.',
    highlight: 'La cercanía a centros logísticos y la competencia local marcan las diferencias.'
  }
];
