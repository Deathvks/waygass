const express = require('express');
const router = express.Router();
const axios = require('axios');
const db = require('../models');
const { PriceHistory } = db;

const API_BASE = 'https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/';

const apiCache = {};
global.cronProgress = { status: 'idle', percent: 100, message: 'Descarga finalizada' };

// Endpoint con filtro por provincia
router.get('/gas/FiltroProvincia/:provincia', async (req, res) => {
  const { provincia } = req.params;
  const now = Date.now();
  
  // Servir caché válida si tiene datos y menos de 30 minutos
  if (apiCache[provincia] && (now - apiCache[provincia].timestamp < 1800000) && apiCache[provincia].data?.ListaEESSPrecio?.length > 0) {
    return res.json(apiCache[provincia].data);
  }

  try {
    const response = await axios.get(`${API_BASE}FiltroProvincia/${provincia}`, {
      headers: { 'Accept': 'application/json' },
      timeout: 12000
    });
    
    // Solo cachear si MITECO devolvió estaciones (evitar cachear vacíos en cambios de hora)
    if (response.data && Array.isArray(response.data.ListaEESSPrecio) && response.data.ListaEESSPrecio.length > 0) {
      apiCache[provincia] = {
        data: response.data,
        timestamp: now
      };
      return res.json(response.data);
    }

    // Si MITECO devolvió lista vacía temporalmente pero tenemos caché previa, servir la previa
    if (apiCache[provincia] && apiCache[provincia].data?.ListaEESSPrecio?.length > 0) {
      return res.json(apiCache[provincia].data);
    }

    res.json(response.data);
  } catch (error) {
    console.error(`Error en el proxy de MITECO para provincia ${provincia}:`, error.message);
    if (apiCache[provincia] && apiCache[provincia].data) {
      return res.json(apiCache[provincia].data);
    }
    res.status(500).json({ error: "Error obteniendo datos de MITECO", ListaEESSPrecio: [] });
  }
});

// Endpoint para toda España
router.get(['/gas', '/gas/'], async (req, res) => {
  const now = Date.now();
  const cacheKey = 'all_spain';

  if (apiCache[cacheKey] && (now - apiCache[cacheKey].timestamp < 1800000) && apiCache[cacheKey].data?.ListaEESSPrecio?.length > 0) {
    return res.json(apiCache[cacheKey].data);
  }

  try {
    const response = await axios.get(API_BASE, {
      headers: { 'Accept': 'application/json' },
      timeout: 25000
    });

    if (response.data && Array.isArray(response.data.ListaEESSPrecio) && response.data.ListaEESSPrecio.length > 0) {
      apiCache[cacheKey] = {
        data: response.data,
        timestamp: now
      };
      return res.json(response.data);
    }

    if (apiCache[cacheKey] && apiCache[cacheKey].data?.ListaEESSPrecio?.length > 0) {
      return res.json(apiCache[cacheKey].data);
    }

    res.json(response.data);
  } catch (error) {
    console.error("Error en proxy MITECO Toda España:", error.message);
    if (apiCache[cacheKey] && apiCache[cacheKey].data) {
      return res.json(apiCache[cacheKey].data);
    }
    res.status(500).json({ error: "Error obteniendo datos de MITECO", ListaEESSPrecio: [] });
  }
});

router.get('/history/:stationId', async (req, res) => {
  try {
    const history = await PriceHistory.findAll({
      where: { stationId: req.params.stationId },
      order: [['date', 'DESC']],
      limit: 30
    });
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
