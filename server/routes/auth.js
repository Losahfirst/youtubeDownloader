const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { auth } = require('../middleware/auth');
const logger = require('../utils/logger');

const router = express.Router();

// Mock user storage (in production, use a database)
const users = [];
let userIdCounter = 1;

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email 
    },
    process.env.JWT_SECRET || 'fallback_secret',
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// Register user
router.post('/register', [
  body('name').notEmpty().withMessage('Le nom est requis'),
  body('email').isEmail().withMessage('Email invalide'),
  body('password').isLength({ min: 6 }).withMessage('Le mot de passe doit faire au moins 6 caractères')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Données invalides',
        details: errors.array()
      });
    }

    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({
        error: 'Un utilisateur avec cet email existe déjà'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = {
      id: userIdCounter++,
      name,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };

    users.push(user);

    // Generate token
    const token = generateToken(user);

    logger.info(`Nouvel utilisateur enregistré: ${email}`);

    res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      }
    });

  } catch (error) {
    logger.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({
      error: 'Erreur lors de l\'inscription',
      message: error.message
    });
  }
});

// Login user
router.post('/login', [
  body('email').isEmail().withMessage('Email invalide'),
  body('password').notEmpty().withMessage('Mot de passe requis')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Données invalides',
        details: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find user
    const user = users.find(user => user.email === email);
    if (!user) {
      return res.status(401).json({
        error: 'Identifiants invalides'
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        error: 'Identifiants invalides'
      });
    }

    // Generate token
    const token = generateToken(user);

    logger.info(`Utilisateur connecté: ${email}`);

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      }
    });

  } catch (error) {
    logger.error('Erreur lors de la connexion:', error);
    res.status(500).json({
      error: 'Erreur lors de la connexion',
      message: error.message
    });
  }
});

// Get current user
router.get('/me', auth, (req, res) => {
  try {
    const user = users.find(user => user.id === req.user.id);
    if (!user) {
      return res.status(404).json({
        error: 'Utilisateur non trouvé'
      });
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    logger.error('Erreur lors de la récupération du profil:', error);
    res.status(500).json({
      error: 'Erreur lors de la récupération du profil',
      message: error.message
    });
  }
});

// Update password
router.put('/password', [
  auth,
  body('currentPassword').notEmpty().withMessage('Mot de passe actuel requis'),
  body('newPassword').isLength({ min: 6 }).withMessage('Le nouveau mot de passe doit faire au moins 6 caractères')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Données invalides',
        details: errors.array()
      });
    }

    const { currentPassword, newPassword } = req.body;
    const user = users.find(user => user.id === req.user.id);

    if (!user) {
      return res.status(404).json({
        error: 'Utilisateur non trouvé'
      });
    }

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        error: 'Mot de passe actuel incorrect'
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    user.password = hashedPassword;

    logger.info(`Mot de passe mis à jour pour: ${user.email}`);

    res.json({
      success: true,
      message: 'Mot de passe mis à jour avec succès'
    });

  } catch (error) {
    logger.error('Erreur lors de la mise à jour du mot de passe:', error);
    res.status(500).json({
      error: 'Erreur lors de la mise à jour du mot de passe',
      message: error.message
    });
  }
});

// Logout (client-side token removal)
router.post('/logout', auth, (req, res) => {
  logger.info(`Utilisateur déconnecté: ${req.user.id}`);
  
  res.json({
    success: true,
    message: 'Déconnexion réussie'
  });
});

module.exports = router;