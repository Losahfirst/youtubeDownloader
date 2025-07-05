const express = require('express');
const { body, validationResult } = require('express-validator');
const { auth } = require('../middleware/auth');
const logger = require('../utils/logger');

const router = express.Router();

// Mock user preferences storage
const userPreferences = {};

// Get user profile
router.get('/profile', auth, (req, res) => {
  try {
    const userId = req.user.id;
    
    // In a real app, this would come from a database
    const mockProfile = {
      id: userId,
      name: 'John Doe',
      email: req.user.email,
      bio: '',
      avatar: null,
      preferences: userPreferences[userId] || getDefaultPreferences(),
      stats: {
        totalDownloads: 42,
        totalShares: 15,
        totalWhatsApp: 28,
        joinedDate: '2024-01-01T00:00:00.000Z'
      }
    };

    res.json({
      success: true,
      data: mockProfile
    });

  } catch (error) {
    logger.error('Erreur lors de la récupération du profil:', error);
    res.status(500).json({
      error: 'Erreur lors de la récupération du profil',
      message: error.message
    });
  }
});

// Update user profile
router.put('/profile', [
  auth,
  body('name').optional().isLength({ min: 1 }).withMessage('Le nom ne peut pas être vide'),
  body('bio').optional().isLength({ max: 500 }).withMessage('La bio ne peut pas dépasser 500 caractères')
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Données invalides',
        details: errors.array()
      });
    }

    const userId = req.user.id;
    const { name, bio } = req.body;

    logger.info(`Profil mis à jour pour l'utilisateur ${userId}`);

    // In a real app, this would update the database
    const updatedProfile = {
      id: userId,
      name: name || 'John Doe',
      email: req.user.email,
      bio: bio || '',
      updatedAt: new Date().toISOString()
    };

    res.json({
      success: true,
      data: updatedProfile,
      message: 'Profil mis à jour avec succès'
    });

  } catch (error) {
    logger.error('Erreur lors de la mise à jour du profil:', error);
    res.status(500).json({
      error: 'Erreur lors de la mise à jour du profil',
      message: error.message
    });
  }
});

// Get user preferences
router.get('/preferences', auth, (req, res) => {
  try {
    const userId = req.user.id;
    const preferences = userPreferences[userId] || getDefaultPreferences();

    res.json({
      success: true,
      data: preferences
    });

  } catch (error) {
    logger.error('Erreur lors de la récupération des préférences:', error);
    res.status(500).json({
      error: 'Erreur lors de la récupération des préférences',
      message: error.message
    });
  }
});

// Update user preferences
router.put('/preferences', auth, (req, res) => {
  try {
    const userId = req.user.id;
    const preferences = req.body;

    // Validate preferences structure
    const validPreferences = validatePreferences(preferences);
    if (!validPreferences.isValid) {
      return res.status(400).json({
        error: 'Préférences invalides',
        details: validPreferences.errors
      });
    }

    // Store preferences
    userPreferences[userId] = {
      ...getDefaultPreferences(),
      ...preferences,
      updatedAt: new Date().toISOString()
    };

    logger.info(`Préférences mises à jour pour l'utilisateur ${userId}`);

    res.json({
      success: true,
      data: userPreferences[userId],
      message: 'Préférences mises à jour avec succès'
    });

  } catch (error) {
    logger.error('Erreur lors de la mise à jour des préférences:', error);
    res.status(500).json({
      error: 'Erreur lors de la mise à jour des préférences',
      message: error.message
    });
  }
});

// Get user statistics
router.get('/stats', auth, (req, res) => {
  try {
    const userId = req.user.id;
    const { period = '30d' } = req.query;

    // In a real app, this would come from database aggregation
    const mockStats = {
      period,
      downloads: {
        total: 42,
        thisMonth: 12,
        thisWeek: 3,
        platforms: {
          youtube: 25,
          facebook: 12,
          linkedin: 5
        }
      },
      whatsapp: {
        total: 28,
        thisMonth: 8,
        thisWeek: 2,
        categories: {
          inspiration: 12,
          business: 8,
          personal: 5,
          creative: 3
        }
      },
      files: {
        total: 15,
        thisMonth: 5,
        thisWeek: 1,
        totalSize: 1024 * 1024 * 500, // 500MB
        totalDownloads: 89
      },
      activity: generateMockActivity(period)
    };

    res.json({
      success: true,
      data: mockStats
    });

  } catch (error) {
    logger.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({
      error: 'Erreur lors de la récupération des statistiques',
      message: error.message
    });
  }
});

// Get user activity history
router.get('/activity', auth, (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20, type } = req.query;

    // Generate mock activity data
    const activities = generateMockActivityHistory(userId, type);
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedActivities = activities.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        activities: paginatedActivities,
        pagination: {
          current: parseInt(page),
          total: Math.ceil(activities.length / limit),
          count: activities.length
        }
      }
    });

  } catch (error) {
    logger.error('Erreur lors de la récupération de l\'activité:', error);
    res.status(500).json({
      error: 'Erreur lors de la récupération de l\'activité',
      message: error.message
    });
  }
});

// Helper functions
function getDefaultPreferences() {
  return {
    notifications: {
      email: true,
      downloads: true,
      shares: false,
      whatsapp: true
    },
    privacy: {
      publicProfile: false,
      showStats: true,
      analytics: true
    },
    appearance: {
      theme: 'light',
      language: 'fr'
    },
    defaultSettings: {
      fileExpiry: 7,
      passwordProtected: false,
      videoQuality: '720p'
    }
  };
}

function validatePreferences(preferences) {
  const errors = [];

  // Validate notifications
  if (preferences.notifications) {
    const validNotificationKeys = ['email', 'downloads', 'shares', 'whatsapp'];
    const notificationKeys = Object.keys(preferences.notifications);
    
    if (!notificationKeys.every(key => validNotificationKeys.includes(key))) {
      errors.push('Clés de notification invalides');
    }
  }

  // Validate theme
  if (preferences.appearance?.theme && !['light', 'dark', 'auto'].includes(preferences.appearance.theme)) {
    errors.push('Thème invalide');
  }

  // Validate language
  if (preferences.appearance?.language && !['fr', 'en', 'es', 'de'].includes(preferences.appearance.language)) {
    errors.push('Langue invalide');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

function generateMockActivity(period) {
  const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
  const activity = [];

  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    activity.push({
      date: date.toISOString().split('T')[0],
      downloads: Math.floor(Math.random() * 5),
      whatsapp: Math.floor(Math.random() * 3),
      files: Math.floor(Math.random() * 2)
    });
  }

  return activity.reverse();
}

function generateMockActivityHistory(userId, type) {
  const activities = [
    {
      id: '1',
      type: 'video',
      title: 'Vidéo YouTube téléchargée',
      description: 'How to Build a React App - Tutorial',
      date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      status: 'success'
    },
    {
      id: '2',
      type: 'whatsapp',
      title: 'Statut WhatsApp partagé',
      description: 'Message motivationnel #Inspiration',
      date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
      status: 'success'
    },
    {
      id: '3',
      type: 'file',
      title: 'Fichier partagé',
      description: 'presentation.pdf (2.3 MB)',
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      status: 'success'
    },
    {
      id: '4',
      type: 'video',
      title: 'Analyse vidéo échouée',
      description: 'URL invalide ou vidéo privée',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      status: 'failed'
    }
  ];

  return type ? activities.filter(activity => activity.type === type) : activities;
}

module.exports = router;