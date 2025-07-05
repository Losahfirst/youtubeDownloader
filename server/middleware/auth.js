const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

const auth = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Accès refusé. Token requis.'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    
    // Add user info to request
    req.user = decoded;
    
    logger.info(`Utilisateur authentifié: ${decoded.id}`);
    next();
    
  } catch (error) {
    logger.warn(`Tentative d'authentification échouée: ${error.message}`);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expiré'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Token invalide'
      });
    }
    
    res.status(401).json({
      error: 'Échec de l\'authentification'
    });
  }
};

// Optional auth middleware (for routes that work with or without auth)
const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
      req.user = decoded;
    }
    
    next();
    
  } catch (error) {
    // If token is invalid, just continue without user info
    next();
  }
};

module.exports = { auth, optionalAuth };