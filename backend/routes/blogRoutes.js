const express = require('express');
const router = express.Router();
const db = require('../models');
const { verifyAdmin } = require('../middlewares/authMiddleware');
const blogAutomationService = require('../services/blogAutomationService');

// ==============================================================================
// RUTAS PÚBLICAS DE ARTÍCULOS
// ==============================================================================

// Listado de artículos publicados
router.get('/blog', async (req, res) => {
  try {
    const { category, limit = 50, offset = 0 } = req.query;
    const where = { status: 'published' };
    if (category && category !== 'all') {
      where.category = category;
    }

    const posts = await db.BlogPost.findAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10)
    });

    res.json({
      success: true,
      count: posts.length,
      articles: posts.map(p => p.toArticleJSON())
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Obtener un artículo por su slug
router.get('/blog/:slug', async (req, res) => {
  try {
    const cleanSlug = String(req.params.slug).trim().toLowerCase();
    const post = await db.BlogPost.findOne({
      where: {
        slug: cleanSlug,
        status: 'published'
      }
    });

    if (!post) {
      return res.status(404).json({ success: false, error: 'Artículo no encontrado' });
    }

    // Incrementar contador de visitas de manera asíncrona
    post.increment('views').catch(() => {});

    res.json({
      success: true,
      article: post.toArticleJSON()
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==============================================================================
// RUTAS DE ADMINISTRACIÓN / IA AUTOMATIZADA
// ==============================================================================

// Estado del servicio editorial IA y logs recientes
router.get('/admin/blog/status', verifyAdmin, async (req, res) => {
  try {
    const totalAiPosts = await db.BlogPost.count({ where: { isAiGenerated: true } });
    const totalViews = await db.BlogPost.sum('views') || 0;
    const hasToday = await blogAutomationService.hasArticleForToday();

    res.json({
      success: true,
      primaryModel: blogAutomationService.primaryModel,
      fallbackModels: blogAutomationService.fallbackModels,
      isGenerating: blogAutomationService.isGenerating,
      publishedToday: hasToday,
      totalAiArticles: totalAiPosts,
      totalViews,
      logs: blogAutomationService.getLogs()
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Generar una noticia de forma manual o bajo demanda
router.post('/admin/blog/generate', verifyAdmin, async (req, res) => {
  try {
    const { force = true, topic = null, category = null } = req.body;
    
    // Iniciar generación
    const result = await blogAutomationService.generateDailyArticle({
      force: !!force,
      customTopic: topic,
      customCategory: category
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Sincronizar archivo frontend/src/data/aiArticles.js manualmente
router.post('/admin/blog/sync', verifyAdmin, async (req, res) => {
  try {
    await blogAutomationService.syncAiArticlesFile();
    res.json({ success: true, message: 'aiArticles.js sincronizado correctamente' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
