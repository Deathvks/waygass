const axios = require('axios');
const db = require('../models');
const { sendTelegramAlert } = require('./alertService');

const API_BASE = 'https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/';

let lastCronError = null;

const parsePrice = (priceStr) => {
  if (!priceStr) return null;
  return parseFloat(priceStr.replace(',', '.'));
};

const fetchAndStoreDailyPrices = async () => {
  let success = false;
  let message = "";
  try {
    global.cronProgress = { status: 'running', percent: 10, message: 'Descargando datos del MITECO...' };
    console.log("[CRON] Iniciando descarga diaria de precios para el histórico...");
    
    
    // El endpoint para TODA España es: 
    // https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/
    const allStationsRes = await axios.get(API_BASE, { 
        headers: { 
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
          'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8'
        }
      });
    
    if (allStationsRes.data && allStationsRes.data.ListaEESSPrecio) {

      const stations = allStationsRes.data.ListaEESSPrecio;
      const today = new Date().toISOString().split('T')[0];
      const records = [];
      for (const s of stations) {
        const id = s['IDEESS'];
        const p95 = parsePrice(s['Precio Gasolina 95 E5']);
        const pdiesel = parsePrice(s['Precio Gasoleo A']);
        
        if (id && (p95 || pdiesel)) {
          records.push({
            stationId: id.toString(),
            date: today,
            price95: p95,
            priceDiesel: pdiesel
          });
        }
      }
      
      // Upsert masivo (muchísimo más rápido en SQLite que insertar uno a uno)
      // Eliminar duplicados en el mismo array por si MITECO devuelve la misma gasolinera 2 veces hoy
        
        global.cronProgress = { status: 'running', percent: 50, message: 'Procesando datos en memoria...' };
        const seen = new Set();
        const uniqueRecords = [];
        for (const r of records) {
          const key = r.stationId + '_' + r.date;
          if (!seen.has(key)) {
            seen.add(key);
            uniqueRecords.push(r);
          }
        }
        
        global.cronProgress = { status: 'running', percent: 60, message: 'Guardando en base de datos...' };
        const batchSize = 2000;
        let inserted = 0;
        for (let i = 0; i < uniqueRecords.length; i += batchSize) {
          const batch = uniqueRecords.slice(i, i + batchSize);
          await db.PriceHistory.bulkCreate(batch, {
            ignoreDuplicates: true,
            validate: false
          });
          inserted += batch.length;
          global.cronProgress = { status: 'running', percent: 60 + Math.floor((inserted / uniqueRecords.length) * 40), message: `Guardando en base de datos (${inserted}/${uniqueRecords.length})...` };
        }


        

      
      global.cronProgress = { status: 'idle', percent: 100, message: 'Descarga finalizada' };
      lastCronError = null;
        
      console.log(`[CRON] Histórico guardado. ${inserted} gasolineras procesadas.`);
      
      success = true;
      message = `${inserted} gasolineras guardadas.`;
      } else {
        const errorMsg = "La API de MITECO no devolvió la lista esperada. Respuesta: " + (typeof allStationsRes.data === 'string' ? allStationsRes.data.substring(0, 100) : JSON.stringify(allStationsRes.data).substring(0, 100));
        console.error("[CRON]", errorMsg);
        lastCronError = errorMsg;
        message = errorMsg;
        global.cronProgress = { status: 'error', percent: 0, message: 'Error de la API del Ministerio' };
      }
      return { success, message };
  } catch (error) {
    global.cronProgress = { status: 'error', percent: 0, message: 'Error descargando datos' };
    console.error("[CRON] Error descargando precios diarios:", error.name, error.message, "PARENT:", error.parent ? error.parent.message : "No parent", "SQL:", error.sql || "No SQL");
  }
};

module.exports = { fetchAndStoreDailyPrices };
