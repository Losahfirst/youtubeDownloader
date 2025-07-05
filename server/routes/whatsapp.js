const express = require('express');
const { body, validationResult } = require('express-validator');
const { optionalAuth } = require('../middleware/auth');
const logger = require('../utils/logger');

const router = express.Router();

// Templates storage
const templates = [
  {
    id: '1',
    name: 'Motivation',
    content: 'Chaque jour est une nouvelle opportunité de briller ✨\n\n#Motivation #Inspiration #Réussite',
    category: 'Inspiration',
    emoji: '✨',
    usage: 125
  },
  {
    id: '2',
    name: 'Entrepreneuriat',
    content: 'Entrepreneur, c\'est transformer les obstacles en opportunités 🚀\n\n#Entrepreneuriat #Business #Innovation',
    category: 'Business',
    emoji: '🚀',
    usage: 89
  },
  {
    id: '3',
    name: 'Gratitude',
    content: 'Reconnaissant pour toutes les bénédictions de la vie 🙏\n\n#Gratitude #Bonheur #Vie',
    category: 'Personnel',
    emoji: '🙏',
    usage: 67
  },
  {
    id: '4',
    name: 'Succès',
    content: 'Le succès commence par un rêve et se réalise par l\'action 💪\n\n#Succès #Determination #Objectifs',
    category: 'Inspiration',
    emoji: '💪',
    usage: 103
  },
  {
    id: '5',
    name: 'Créativité',
    content: 'L\'imagination est plus importante que la connaissance 🎨\n\n#Créativité #Innovation #Art',
    category: 'Créatif',
    emoji: '🎨',
    usage: 45
  },
  {
    id: '6',
    name: 'Travail d\'équipe',
    content: 'Ensemble, nous sommes plus forts 🤝\n\n#Équipe #Collaboration #Ensemble',
    category: 'Professionnel',
    emoji: '🤝',
    usage: 78
  }
];

// Get all templates
router.get('/templates', optionalAuth, (req, res) => {
  try {
    const { category } = req.query;
    
    let filteredTemplates = templates;
    
    if (category && category !== 'Tous') {
      filteredTemplates = templates.filter(template => template.category === category);
    }

    // Sort by usage (most popular first)
    filteredTemplates.sort((a, b) => b.usage - a.usage);

    res.json({
      success: true,
      data: filteredTemplates
    });

  } catch (error) {
    logger.error('Erreur lors de la récupération des templates:', error);
    res.status(500).json({
      error: 'Erreur lors de la récupération des templates',
      message: error.message
    });
  }
});

// Get template categories
router.get('/categories', (req, res) => {
  try {
    const categories = [...new Set(templates.map(template => template.category))];
    
    res.json({
      success: true,
      data: categories
    });

  } catch (error) {
    logger.error('Erreur lors de la récupération des catégories:', error);
    res.status(500).json({
      error: 'Erreur lors de la récupération des catégories',
      message: error.message
    });
  }
});

// Generate WhatsApp share URL
router.post('/share', [
  body('message').notEmpty().withMessage('Le message est requis'),
  body('message').isLength({ max: 1000 }).withMessage('Le message ne peut pas dépasser 1000 caractères')
], optionalAuth, (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Données invalides',
        details: errors.array()
      });
    }

    const { message, templateId } = req.body;
    const userId = req.user?.id;

    // Encode message for WhatsApp URL
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;

    // Update template usage if templateId is provided
    if (templateId) {
      const template = templates.find(t => t.id === templateId);
      if (template) {
        template.usage += 1;
      }
    }

    logger.info(`Message WhatsApp généré${userId ? ` par l'utilisateur ${userId}` : ''}`);

    res.json({
      success: true,
      data: {
        message,
        whatsappUrl,
        shortUrl: whatsappUrl, // In production, you might want to use a URL shortener
        shareId: Date.now().toString() // Generate a unique ID for tracking
      }
    });

  } catch (error) {
    logger.error('Erreur lors de la génération du lien WhatsApp:', error);
    res.status(500).json({
      error: 'Erreur lors de la génération du lien WhatsApp',
      message: error.message
    });
  }
});

// Get random template
router.get('/random', optionalAuth, (req, res) => {
  try {
    const { category } = req.query;
    
    let availableTemplates = templates;
    
    if (category && category !== 'Tous') {
      availableTemplates = templates.filter(template => template.category === category);
    }

    if (availableTemplates.length === 0) {
      return res.status(404).json({
        error: 'Aucun template trouvé pour cette catégorie'
      });
    }

    const randomTemplate = availableTemplates[Math.floor(Math.random() * availableTemplates.length)];

    res.json({
      success: true,
      data: randomTemplate
    });

  } catch (error) {
    logger.error('Erreur lors de la récupération du template aléatoire:', error);
    res.status(500).json({
      error: 'Erreur lors de la récupération du template aléatoire',
      message: error.message
    });
  }
});

// Get template by ID
router.get('/templates/:id', optionalAuth, (req, res) => {
  try {
    const { id } = req.params;
    
    const template = templates.find(t => t.id === id);
    
    if (!template) {
      return res.status(404).json({
        error: 'Template non trouvé'
      });
    }

    res.json({
      success: true,
      data: template
    });

  } catch (error) {
    logger.error('Erreur lors de la récupération du template:', error);
    res.status(500).json({
      error: 'Erreur lors de la récupération du template',
      message: error.message
    });
  }
});

// Get sharing statistics
router.get('/stats', optionalAuth, (req, res) => {
  try {
    const totalShares = templates.reduce((sum, template) => sum + template.usage, 0);
    const mostPopular = templates.reduce((prev, current) => 
      (prev.usage > current.usage) ? prev : current
    );
    
    const categoryStats = templates.reduce((acc, template) => {
      if (!acc[template.category]) {
        acc[template.category] = 0;
      }
      acc[template.category] += template.usage;
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        totalShares,
        totalTemplates: templates.length,
        mostPopular: {
          id: mostPopular.id,
          name: mostPopular.name,
          usage: mostPopular.usage
        },
        categoryStats
      }
    });

  } catch (error) {
    logger.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({
      error: 'Erreur lors de la récupération des statistiques',
      message: error.message
    });
  }
});

module.exports = router;