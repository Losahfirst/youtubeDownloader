const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');
const { body, validationResult } = require('express-validator');
const { auth, optionalAuth } = require('../middleware/auth');
const logger = require('../utils/logger');

const router = express.Router();

// File storage
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/files');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}_${uuidv4()}`;
    const extension = path.extname(file.originalname);
    const filename = `${uniqueSuffix}${extension}`;
    cb(null, filename);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Allow all file types for now
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
    files: 5 // Maximum 5 files at once
  }
});

// Mock database for shared files
const sharedFiles = [];

// Upload files
router.post('/upload', auth, upload.array('files', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        error: 'Aucun fichier sélectionné'
      });
    }

    const { expiryDays = 7, password, description } = req.body;
    const userId = req.user.id;
    const uploadId = uuidv4();

    // Calculate expiry date
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + parseInt(expiryDays));

    const uploadedFiles = req.files.map(file => {
      const fileId = uuidv4();
      const shareableFile = {
        id: fileId,
        uploadId,
        originalName: file.originalname,
        filename: file.filename,
        mimetype: file.mimetype,
        size: file.size,
        path: file.path,
        userId,
        shareLink: `${req.protocol}://${req.get('host')}/api/files/download/${fileId}`,
        shortId: fileId.substring(0, 8),
        password: password || null,
        description: description || '',
        downloads: 0,
        createdAt: new Date().toISOString(),
        expiresAt: expiresAt.toISOString(),
        isActive: true
      };

      sharedFiles.push(shareableFile);
      return shareableFile;
    });

    logger.info(`${req.files.length} fichier(s) uploadé(s) par l'utilisateur ${userId}`);

    // Return file info without sensitive data
    const responseFiles = uploadedFiles.map(file => ({
      id: file.id,
      originalName: file.originalName,
      size: file.size,
      mimetype: file.mimetype,
      shareLink: file.shareLink,
      shortId: file.shortId,
      downloads: file.downloads,
      createdAt: file.createdAt,
      expiresAt: file.expiresAt,
      isProtected: !!file.password
    }));

    res.json({
      success: true,
      data: {
        uploadId,
        files: responseFiles
      }
    });

  } catch (error) {
    logger.error('Erreur lors de l\'upload:', error);
    
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'Fichier trop volumineux (max 100MB)'
      });
    }
    
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        error: 'Trop de fichiers (max 5 fichiers)'
      });
    }

    res.status(500).json({
      error: 'Erreur lors de l\'upload',
      message: error.message
    });
  }
});

// Download file
router.get('/download/:fileId', optionalAuth, async (req, res) => {
  try {
    const { fileId } = req.params;
    const { password } = req.query;
    
    const file = sharedFiles.find(f => f.id === fileId && f.isActive);
    
    if (!file) {
      return res.status(404).json({
        error: 'Fichier non trouvé ou expiré'
      });
    }

    // Check if file has expired
    if (new Date() > new Date(file.expiresAt)) {
      file.isActive = false;
      return res.status(410).json({
        error: 'Ce lien a expiré'
      });
    }

    // Check password if required
    if (file.password && file.password !== password) {
      return res.status(401).json({
        error: 'Mot de passe requis',
        requiresPassword: true
      });
    }

    // Check if file exists on disk
    try {
      await fs.access(file.path);
    } catch (error) {
      return res.status(404).json({
        error: 'Fichier non trouvé sur le serveur'
      });
    }

    // Increment download count
    file.downloads += 1;

    logger.info(`Fichier téléchargé: ${file.originalName} (${file.downloads} téléchargements)`);

    // Set appropriate headers
    res.setHeader('Content-Disposition', `attachment; filename="${file.originalName}"`);
    res.setHeader('Content-Type', file.mimetype);

    // Send file
    res.sendFile(path.resolve(file.path));

  } catch (error) {
    logger.error('Erreur lors du téléchargement:', error);
    res.status(500).json({
      error: 'Erreur lors du téléchargement',
      message: error.message
    });
  }
});

// Get file info
router.get('/info/:fileId', optionalAuth, (req, res) => {
  try {
    const { fileId } = req.params;
    
    const file = sharedFiles.find(f => f.id === fileId && f.isActive);
    
    if (!file) {
      return res.status(404).json({
        error: 'Fichier non trouvé'
      });
    }

    // Check if file has expired
    if (new Date() > new Date(file.expiresAt)) {
      file.isActive = false;
      return res.status(410).json({
        error: 'Ce lien a expiré'
      });
    }

    const fileInfo = {
      id: file.id,
      originalName: file.originalName,
      size: file.size,
      mimetype: file.mimetype,
      description: file.description,
      downloads: file.downloads,
      createdAt: file.createdAt,
      expiresAt: file.expiresAt,
      isProtected: !!file.password,
      requiresPassword: !!file.password
    };

    res.json({
      success: true,
      data: fileInfo
    });

  } catch (error) {
    logger.error('Erreur lors de la récupération des infos du fichier:', error);
    res.status(500).json({
      error: 'Erreur lors de la récupération des informations',
      message: error.message
    });
  }
});

// Get user's uploaded files
router.get('/my-files', auth, (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;
    
    const userFiles = sharedFiles
      .filter(file => file.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedFiles = userFiles.slice(startIndex, endIndex);

    const responseFiles = paginatedFiles.map(file => ({
      id: file.id,
      originalName: file.originalName,
      size: file.size,
      mimetype: file.mimetype,
      shareLink: file.shareLink,
      shortId: file.shortId,
      downloads: file.downloads,
      createdAt: file.createdAt,
      expiresAt: file.expiresAt,
      isProtected: !!file.password,
      isActive: file.isActive && new Date() <= new Date(file.expiresAt)
    }));

    res.json({
      success: true,
      data: {
        files: responseFiles,
        pagination: {
          current: parseInt(page),
          total: Math.ceil(userFiles.length / limit),
          count: userFiles.length
        }
      }
    });

  } catch (error) {
    logger.error('Erreur lors de la récupération des fichiers utilisateur:', error);
    res.status(500).json({
      error: 'Erreur lors de la récupération des fichiers',
      message: error.message
    });
  }
});

// Delete file
router.delete('/:fileId', auth, async (req, res) => {
  try {
    const { fileId } = req.params;
    const userId = req.user.id;
    
    const fileIndex = sharedFiles.findIndex(f => f.id === fileId && f.userId === userId);
    
    if (fileIndex === -1) {
      return res.status(404).json({
        error: 'Fichier non trouvé ou accès refusé'
      });
    }

    const file = sharedFiles[fileIndex];

    // Delete file from disk
    try {
      await fs.unlink(file.path);
    } catch (error) {
      logger.warn(`Fichier déjà supprimé du disque: ${file.path}`);
    }

    // Remove from database
    sharedFiles.splice(fileIndex, 1);

    logger.info(`Fichier supprimé: ${file.originalName} par l'utilisateur ${userId}`);

    res.json({
      success: true,
      message: 'Fichier supprimé avec succès'
    });

  } catch (error) {
    logger.error('Erreur lors de la suppression:', error);
    res.status(500).json({
      error: 'Erreur lors de la suppression',
      message: error.message
    });
  }
});

// Get sharing statistics
router.get('/stats', auth, (req, res) => {
  try {
    const userId = req.user.id;
    const userFiles = sharedFiles.filter(file => file.userId === userId);

    const stats = {
      totalFiles: userFiles.length,
      totalDownloads: userFiles.reduce((sum, file) => sum + file.downloads, 0),
      totalSize: userFiles.reduce((sum, file) => sum + file.size, 0),
      activeFiles: userFiles.filter(file => file.isActive && new Date() <= new Date(file.expiresAt)).length,
      expiredFiles: userFiles.filter(file => !file.isActive || new Date() > new Date(file.expiresAt)).length
    };

    res.json({
      success: true,
      data: stats
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