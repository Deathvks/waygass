const express = require('express');
const router = express.Router();
const axios = require('axios');
const db = require('../models');
const { PriceHistory } = db;

const API_BASE = 'https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/';

const apiCache = {};
      global.cronProgress = { status: 'idle', percent: 100, message: 'Descarga finalizada' };
let lastCronError = null;

router.get('/gas/FiltroProvincia/:provincia', async (req, res) => {
  try {
    const { provincia } = req.params;
    const now = Date.now();
    
    if (apiCache[provincia] && (now - apiCache[provincia].timestamp < 1800000)) {
      return res.json(apiCache[provincia].data);
    }

    const response = await axios.get(`${API_BASE}FiltroProvincia/${provincia}`, {
      headers: { 'Accept': 'application/json' }
    });
    
    apiCache[provincia] = {
      data: response.data,
      timestamp: now
    };
    
    res.json(response.data);
  } catch (error) {
    console.error("Error en el proxy de MITECO:", error.message);
    res.status(500).json({ error: "Error obteniendo datos de MITECO" });
  }
});


module.exports = router;
