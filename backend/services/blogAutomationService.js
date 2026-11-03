const fs = require('fs');
const path = require('path');
const { Op } = require('sequelize');
const db = require('../models');

// ==============================================================================
// CATÁLOGO CURADO DE FOTOS AUTOMOTRICES 16:9 VERIFICADAS (HTTP 200 OK)
// Cada una tiene un ID único de Unsplash comprobado para garantizar que nunca se repitan.
// ==============================================================================
const AUTOMOTIVE_IMAGE_POOLS = {
  gasolinera: [
    {
      url: 'https://images.unsplash.com/photo-1545459720-aac8509eb02c?auto=format&fit=crop&w=1200&h=675&q=80',
      alt: 'Surtidor de gasolina y manguera de repostaje en estación de servicio',
      caption: 'Foto: Archivo WayGass / Pista de repostaje en estación de servicio.'
    },
    {
      url: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=1200&h=675&q=80',
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
    },
    {
      url: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=1200&h=675&q=80',
      alt: 'Manguera de carburante suministrando gasolina 95',
      caption: 'Foto: Archivo WayGass / Boquerel de gasolina en repostaje.'
    },
    {
      url: 'https://images.unsplash.com/photo-1617704548623-0a05a0a19621?auto=format&fit=crop&w=1200&h=675&q=80',
      alt: 'Pista de estación de servicio en autopista',
      caption: 'Foto: Archivo WayGass / Estación de servicio en ruta.'
    }
  ],
  mecanica: [
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
    },
    {
      url: 'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&w=1200&h=675&q=80',
      alt: 'Reparación de componentes mecánicos y motor de automoción',
      caption: 'Foto: Archivo WayGass / Reparación y sustitución de piezas mecánicas.'
    },
    {
      url: 'https://images.unsplash.com/photo-1613214149922-f1809c99b414?auto=format&fit=crop&w=1200&h=675&q=80',
      alt: 'Taller de reparación con herramientas y motor abierto',
      caption: 'Foto: Archivo WayGass / Taller electromecánico multimarca.'
    },
    {
      url: 'https://images.unsplash.com/photo-1567808291548-fc3ee04dbcf0?auto=format&fit=crop&w=1200&h=675&q=80',
      alt: 'Vano motor y correa de distribución del vehículo',
      caption: 'Foto: Archivo WayGass / Inspección visual del vano motor.'
    },
    {
      url: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=1200&h=675&q=80',
      alt: 'Detalle de bloque motor de combustión interna',
      caption: 'Foto: Archivo WayGass / Mecánica interna de cilindros e inyección.'
    },
    {
      url: 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&w=1200&h=675&q=80',
      alt: 'Juego de llaves y herramientas para mantenimiento de vehículos',
      caption: 'Foto: Archivo WayGass / Utillaje especializado de automoción.'
    },
    {
      url: 'https://images.unsplash.com/photo-1530906358829-e84b2769270f?auto=format&fit=crop&w=1200&h=675&q=80',
      alt: 'Batería de coche y bornes de conexión eléctrica',
      caption: 'Foto: Archivo WayGass / Comprobación del sistema eléctrico y batería.'
    },
    {
      url: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&w=1200&h=675&q=80',
      alt: 'Cambio de aceite de motor y sustitución de filtro',
      caption: 'Foto: Archivo WayGass / Mantenimiento periódico de lubricación.'
    },
    {
      url: 'https://images.unsplash.com/photo-1504215680853-026ed2a45def?auto=format&fit=crop&w=1200&h=675&q=80',
      alt: 'Mecánico comprobando amortiguadores y suspensión',
      caption: 'Foto: Archivo WayGass / Inspección del tren de rodaje.'
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
    },
    {
      url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&h=675&q=80',
      alt: 'Vehículo en viaje por autopista a velocidad de crucero',
      caption: 'Foto: Archivo WayGass / Velocidad constante para minimizar consumo.'
    },
    {
      url: 'https://images.unsplash.com/photo-1526726538690-5cbf956ae2fd?auto=format&fit=crop&w=1200&h=675&q=80',
      alt: 'Asfalto en autopista con marcas viales de carril',
      caption: 'Foto: Archivo WayGass / Vías de alta capacidad y rodadura.'
    },
    {
      url: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&h=675&q=80',
      alt: 'Puesto de conducción y volante de coche moderno',
      caption: 'Foto: Archivo WayGass / Ergonomía y control de crucero.'
    },
    {
      url: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&h=675&q=80',
      alt: 'Cuadro de instrumentos iluminado en conducción nocturna',
      caption: 'Foto: Archivo WayGass / Conducción nocturna y monitorización de consumo.'
    },
    {
      url: 'https://images.unsplash.com/photo-1516515429572-11c521096a66?auto=format&fit=crop&w=1200&h=675&q=80',
      alt: 'Conductor atento a la carretera y al tráfico',
      caption: 'Foto: Archivo WayGass / Anticipación en carretera para evitar frenazos.'
    },
    {
      url: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1200&h=675&q=80',
      alt: 'Tacómetro y aguja de revoluciones en régimen óptimo',
      caption: 'Foto: Archivo WayGass / Régimen de giro del motor eficiente.'
    },
    {
      url: 'https://images.unsplash.com/photo-1551830820-330a71b99659?auto=format&fit=crop&w=1200&h=675&q=80',
      alt: 'Coche en viaje de larga distancia por autovía',
      caption: 'Foto: Archivo WayGass / Planificación de trayecto y paradas de repostaje.'
    },
    {
      url: 'https://images.unsplash.com/photo-1537984822441-cff330075342?auto=format&fit=crop&w=1200&h=675&q=80',
      alt: 'Carretera de montaña despejada con curvas suaves',
      caption: 'Foto: Archivo WayGass / Gestión de freno motor en bajadas.'
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
    },
    {
      url: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1200&h=675&q=80',
      alt: 'Llanta de aleación y neumático con perfil deportivo',
      caption: 'Foto: Archivo WayGass / Desgaste regular de la banda de rodadura.'
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
    },
    {
      url: 'https://images.unsplash.com/photo-1507767439269-2c64f107e609?auto=format&fit=crop&w=1200&h=675&q=80',
      alt: 'Luces de tráfico y autovía en hora punta',
      caption: 'Foto: Archivo WayGass / Control de velocidad y fluidez del tráfico.'
    },
    {
      url: 'https://images.unsplash.com/photo-1514316454349-750a7fd3da3a?auto=format&fit=crop&w=1200&h=675&q=80',
      alt: 'Tráfico denso en autovía de circunvalación',
      caption: 'Foto: Archivo WayGass / Normas de circulación en congestiones.'
    },
    {
      url: 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&w=1200&h=675&q=80',
      alt: 'Carril de incorporación y señalización en autovía',
      caption: 'Foto: Archivo WayGass / Vías de acceso y límites de velocidad.'
    },
    {
      url: 'https://images.unsplash.com/photo-1511994298241-608e28f14fde?auto=format&fit=crop&w=1200&h=675&q=80',
      alt: 'Trazado de carretera convencional con guardarraíles',
      caption: 'Foto: Archivo WayGass / Seguridad vial en vías secundarias.'
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
    },
    {
      url: 'https://images.unsplash.com/photo-1494905998402-395d579af36f?auto=format&fit=crop&w=1200&h=675&q=80',
      alt: 'Consola central y controles de climatización automática',
      caption: 'Foto: Archivo WayGass / Gestión térmica del habitáculo.'
    },
    {
      url: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&h=675&q=80',
      alt: 'Lavado a presión de vehículo en gasolinera',
      caption: 'Foto: Archivo WayGass / Cuidado de carrocería y visibilidad de lunas.'
    }
  ],
  hibrido: [
    {
      url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&h=675&q=80',
      alt: 'Punto de recarga para vehículo electrificado en vía pública',
      caption: 'Foto: Archivo WayGass / Estación de carga rápida para híbridos y eléctricos.'
    },
    {
      url: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1200&h=675&q=80',
      alt: 'Cable de carga enchufado a la toma de corriente de un coche',
      caption: 'Foto: Archivo WayGass / Repostaje eléctrico y eficiencia energética.'
    }
  ],
  general: [
    {
      url: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&h=675&q=80',
      alt: 'Frontal aerodinámico y ópticas de vehículo moderno',
      caption: 'Foto: Archivo WayGass / Aerodinámica y eficiencia vehicular.'
    },
    {
      url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&h=675&q=80',
      alt: 'Línea lateral y silueta de coche en autovía',
      caption: 'Foto: Archivo WayGass / Diseño y coeficiente de penetración aerodinámica.'
    },
    {
      url: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1200&h=675&q=80',
      alt: 'Faros LED de alta intensidad para conducción segura',
      caption: 'Foto: Archivo WayGass / Alumbrado y visibilidad nocturna.'
    },
    {
      url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&h=675&q=80',
      alt: 'Faros delanteros iluminando la calzada en carretera',
      caption: 'Foto: Archivo WayGass / Conducción nocturna con visibilidad óptima.'
    },
    {
      url: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&h=675&q=80',
      alt: 'Frontal y rejilla de refrigeración de motor',
      caption: 'Foto: Archivo WayGass / Flujo de aire y refrigeración del radiador.'
    },
    {
      url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&h=675&q=80',
      alt: 'Vehículo en marcha por vía interurbana',
      caption: 'Foto: Archivo WayGass / Movilidad interurbana y consumo real.'
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
    imageKey: 'hibrido',
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
    this.currentStep = 'En espera (cron programado a las 06:00 AM)';
    this.lastRun = null;
    this.logs = [];
    this.primaryModel = 'gemini-3.6-flash';
    this.fallbackModels = ['gemini-3.5-flash-lite', 'gemini-2.5-flash'];
  }

  // Próxima hora de ejecución del cron (06:00 AM)
  getNextScheduledTime() {
    const now = new Date();
    const next = new Date(now);
    next.setHours(6, 0, 0, 0); // 06:00 AM
    if (now.getTime() >= next.getTime()) {
      next.setDate(next.getDate() + 1); // Mañana a las 06:00 AM
    }
    return next.toISOString();
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

  // Extrae la firma única de una foto (identificador de Unsplash o nombre de archivo)
  getPhotoSignature(url) {
    if (!url) return '';
    const match = url.match(/photo-([a-zA-Z0-9_-]+)/);
    if (match) return match[1];
    return url.split('?')[0].trim().toLowerCase();
  }

  // Recopila todas las firmas de fotos ya utilizadas en el historial del blog para NO repetir jamás
  async getUsedPhotoSignatures() {
    const used = new Set();

    // 1. Fotos en la Base de Datos SQLite (BlogPost)
    try {
      const posts = await db.BlogPost.findAll({ attributes: ['image'] });
      posts.forEach(p => {
        if (p.image) used.add(this.getPhotoSignature(p.image));
      });
    } catch (e) {}

    // 2. Fotos en aiArticles.js
    try {
      const aiPath = path.resolve(__dirname, '../../frontend/src/data/aiArticles.js');
      if (fs.existsSync(aiPath)) {
        const content = fs.readFileSync(aiPath, 'utf8');
        const matches = content.match(/photo-[a-zA-Z0-9_-]+/g) || [];
        matches.forEach(m => used.add(m.replace('photo-', '')));
      }
    } catch (e) {}

    // 3. Fotos en los 14 posts estáticos originales de blogData.js
    try {
      const blogDataPath = path.resolve(__dirname, '../../frontend/src/data/blogData.js');
      if (fs.existsSync(blogDataPath)) {
        const content = fs.readFileSync(blogDataPath, 'utf8');
        const matches = content.match(/\/blog-[a-zA-Z0-9_-]+\.jpg/g) || [];
        matches.forEach(m => used.add(m));
      }
    } catch (e) {}

    return used;
  }

  // Selección inteligente y GARANTIZADA DE NO REPETIR NUNCA MINIATURA
  async pickUniqueImage(imageKey) {
    const usedSignatures = await this.getUsedPhotoSignatures();
    this.addLog(`Comprobando miniaturas: ${usedSignatures.size} foto(s) registradas en el histórico.`, 'info');

    // 1. Intentar en la categoría temática indicada
    const categoryPool = AUTOMOTIVE_IMAGE_POOLS[imageKey] || AUTOMOTIVE_IMAGE_POOLS.gasolinera;
    const availableInCategory = categoryPool.filter(img => !usedSignatures.has(this.getPhotoSignature(img.url)));

    if (availableInCategory.length > 0) {
      const chosen = availableInCategory[Math.floor(Math.random() * availableInCategory.length)];
      this.addLog(`📸 Miniatura única seleccionada de categoría '${imageKey}': ${this.getPhotoSignature(chosen.url)}`, 'success');
      return chosen;
    }

    // 2. Si la categoría específica se agotó, buscar en TODO el catálogo automotriz
    const allImages = Object.values(AUTOMOTIVE_IMAGE_POOLS).flat();
    const availableOverall = allImages.filter(img => !usedSignatures.has(this.getPhotoSignature(img.url)));

    if (availableOverall.length > 0) {
      const chosen = availableOverall[Math.floor(Math.random() * availableOverall.length)];
      this.addLog(`📸 Miniatura única seleccionada de catálogo general: ${this.getPhotoSignature(chosen.url)}`, 'success');
      return chosen;
    }

    // 3. Si en algún momento futuro se agotaran todas las predefinidas, fallback con seed único
    const timestampSeed = Date.now();
    this.addLog(`⚠️ Todas las fotos del catálogo han sido usadas. Generando foto automotriz única con seed #${timestampSeed}...`, 'warn');
    return {
      url: `https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&h=675&q=80&sig=${timestampSeed}`,
      alt: 'Fotografía automotriz y de carretera WayGass',
      caption: 'Foto: Archivo WayGass / Actualidad del motor y carreteras.'
    };
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
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY no configurada en las variables de entorno.');
    }
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

      // Actualizar sitemap.xml en dist y public si existen
      const sitemapPaths = [
        path.join(distDir, 'sitemap.xml'),
        path.resolve(__dirname, '../../frontend/public/sitemap.xml')
      ];
      for (const sitemapPath of sitemapPaths) {
        if (fs.existsSync(sitemapPath)) {
          let sm = fs.readFileSync(sitemapPath, 'utf8');
          if (!sm.includes(canonical)) {
            const newEntry = `  <url>\n    <loc>${canonical}</loc>\n    <lastmod>${article.dateISO.split('T')[0]}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>\n</urlset>`;
            sm = sm.replace('</urlset>', newEntry);
            fs.writeFileSync(sitemapPath, sm, 'utf8');
          }
        }
      }
      this.addLog('sitemap.xml actualizado en dist y public.', 'success');

      // Actualizar rss.xml en dist y public si existen
      const rssPaths = [
        path.join(distDir, 'rss.xml'),
        path.resolve(__dirname, '../../frontend/public/rss.xml')
      ];
      for (const rssPath of rssPaths) {
        if (fs.existsSync(rssPath)) {
          let rss = fs.readFileSync(rssPath, 'utf8');
          if (!rss.includes(canonical)) {
            const pubDate = new Date(article.dateISO).toUTCString();
            const rawImg = article.image || '/logo.png';
            const imgUrl = rawImg.startsWith('http') ? rawImg : `https://waygass.es${rawImg}`;
            const enclosureUrl = imgUrl.replace(/&/g, '&amp;');
            const safeTitle = (article.title || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
            const safeExcerpt = (article.excerpt || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
            const safeCategory = (article.category || 'Motor').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            const newItem = `    <item>\n      <title>${safeTitle}</title>\n      <link>${canonical}</link>\n      <guid isPermaLink="true">${canonical}</guid>\n      <pubDate>${pubDate}</pubDate>\n      <description>${safeExcerpt}</description>\n      <enclosure url="${enclosureUrl}" type="image/jpeg" length="0" />\n      <category>${safeCategory}</category>\n    </item>\n`;
            rss = rss.replace(/(<atom:link [^>]+>\r?\n)/, `$1${newItem}`);
            fs.writeFileSync(rssPath, rss, 'utf8');
          }
        }
      }
      this.addLog('rss.xml actualizado automáticamente en dist y public.', 'success');
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
    this.currentStep = '1/5. Iniciando motor editorial y seleccionando temática con alto CTR...';
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

      this.currentStep = `2/5. Tema elegido: "${chosenIdea.topic}". Buscando miniatura 16:9 única...`;
      this.addLog(`Tema seleccionado: "${chosenIdea.topic}" (Categoría: ${chosenIdea.category})`, 'info');

      // Seleccionar imagen temática única GARANTIZADA DE NO REPETIRSE NUNCA
      const coverPhoto = await this.pickUniqueImage(chosenIdea.imageKey);

      this.currentStep = `3/5. Redactando reportaje en profundidad con Gemini 3.6 Flash...`;

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
      this.currentStep = '4/5. Guardando en base de datos SQLite y sincronizando frontend...';
      const createdPost = await db.BlogPost.create(articlePayload);
      const articleJson = createdPost.toArticleJSON();

      this.addLog(`🎉 Artículo guardado en Base de Datos: "${articleJson.title}" (/blog/${articleJson.slug})`, 'success');

      // 1. Sincronizar archivo frontend/src/data/aiArticles.js
      await this.syncAiArticlesFile();

      // 2. Pre-renderizar estáticamente en dist/ si existe
      this.currentStep = '5/5. Pre-renderizando HTML y actualizando Sitemap y RSS...';
      await this.prerenderArticleInDist(articleJson);

      // 3. Notificar a Telegram si está activo
      await this.notifyTelegram(articleJson);

      this.currentStep = `Completado con éxito: "${articleJson.title}". Próxima generación programada para las 06:00 AM.`;
      this.lastRun = {
        status: 'success',
        timestamp: new Date().toISOString(),
        article: articleJson,
        modelUsed: this.primaryModel
      };

      return {
        status: 'success',
        article: articleJson
      };
    } catch (err) {
      this.currentStep = `Error en última ejecución: ${err.message}`;
      this.lastRun = {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: err.message,
        modelUsed: this.primaryModel
      };
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
