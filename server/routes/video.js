const express = require('express');
const youtubeDl = require('youtube-dl-exec');
const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');
const { body, validationResult } = require('express-validator');
const logger = require('../utils/logger');
const auth = require('../middleware/auth');

const router = express.Router();

// Validate video URL
const validateVideoUrl = (url) => {
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)/;
  const facebookRegex = /^(https?:\/\/)?(www\.)?facebook\.com/;
  const linkedinRegex = /^(https?:\/\/)?(www\.)?linkedin\.com/;
  
  return youtubeRegex.test(url) || facebookRegex.test(url) || linkedinRegex.test(url);
};

// Get video platform
const getVideoPlatform = (url) => {
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
  if (url.includes('facebook.com')) return 'facebook';
  if (url.includes('linkedin.com')) return 'linkedin';
  return 'unknown';
};

// Analyze video URL
router.post('/analyze', [
  body('url').isURL().withMessage('URL invalide'),
  body('url').custom(url => {
    if (!validateVideoUrl(url)) {
      throw new Error('Plateforme non supportée');
    }
    return true;
  })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Données invalides',
        details: errors.array()
      });
    }

    const { url } = req.body;
    const platform = getVideoPlatform(url);

    logger.info(`Analyse de la vidéo: ${url}`);

    // Get video info without downloading
    const info = await youtubeDl(url, {
      dumpSingleJson: true,
      noCheckCertificates: true,
      noWarnings: true,
      extractFlat: false
    });

    // Extract available formats
    const formats = info.formats ? info.formats
      .filter(format => format.height && format.ext)
      .map(format => ({
        quality: format.height ? `${format.height}p` : 'Audio',
        format: format.ext.toUpperCase(),
        size: format.filesize ? `${Math.round(format.filesize / 1024 / 1024)} MB` : 'N/A',
        formatId: format.format_id
      }))
      .sort((a, b) => {
        const aHeight = parseInt(a.quality) || 0;
        const bHeight = parseInt(b.quality) || 0;
        return bHeight - aHeight;
      }) : [];

    // Add audio-only option
    if (info.formats && info.formats.find(f => f.acodec && f.acodec !== 'none')) {
      formats.push({
        quality: 'Audio',
        format: 'MP3',
        size: 'N/A',
        formatId: 'bestaudio'
      });
    }

    const videoInfo = {
      title: info.title || 'Titre non disponible',
      description: info.description || '',
      thumbnail: info.thumbnail || '',
      duration: info.duration ? Math.floor(info.duration) : 0,
      views: info.view_count || 0,
      uploader: info.uploader || '',
      platform,
      formats,
      originalUrl: url
    };

    res.json({
      success: true,
      data: videoInfo
    });

  } catch (error) {
    logger.error('Erreur lors de l\'analyse de la vidéo:', error);
    res.status(500).json({
      error: 'Erreur lors de l\'analyse de la vidéo',
      message: error.message
    });
  }
});

// Download video
router.post('/download', [
  auth,
  body('url').isURL().withMessage('URL invalide'),
  body('formatId').notEmpty().withMessage('Format requis'),
  body('quality').notEmpty().withMessage('Qualité requise')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Données invalides',
        details: errors.array()
      });
    }

    const { url, formatId, quality } = req.body;
    const userId = req.user.id;
    const downloadId = uuidv4();
    const platform = getVideoPlatform(url);

    logger.info(`Téléchargement de la vidéo: ${url} par l'utilisateur ${userId}`);

    // Create download directory if it doesn't exist
    const downloadDir = path.join(__dirname, '../uploads/videos');
    await fs.mkdir(downloadDir, { recursive: true });

    // Get video info first
    const info = await youtubeDl(url, {
      dumpSingleJson: true,
      noCheckCertificates: true,
      noWarnings: true
    });

    const filename = `${downloadId}_${info.title.replace(/[^a-zA-Z0-9]/g, '_')}.%(ext)s`;
    const outputPath = path.join(downloadDir, filename);

    // Send initial response
    res.json({
      success: true,
      data: {
        downloadId,
        title: info.title,
        status: 'started',
        progress: 0
      }
    });

    // Start download in background
    const downloadProcess = async () => {
      try {
        const io = req.app.get('io');
        
        // Update progress
        const updateProgress = (progress) => {
          io.to(`user-${userId}`).emit('download-progress', {
            downloadId,
            progress,
            status: 'downloading'
          });
        };

        let downloadOptions = {
          output: outputPath,
          noCheckCertificates: true,
          noWarnings: true
        };

        if (formatId === 'bestaudio') {
          downloadOptions.extractAudio = true;
          downloadOptions.audioFormat = 'mp3';
          downloadOptions.audioQuality = '192K';
        } else {
          downloadOptions.format = formatId;
        }

        // Execute download
        await youtubeDl(url, downloadOptions);

        // Find the actual downloaded file
        const files = await fs.readdir(downloadDir);
        const downloadedFile = files.find(file => file.startsWith(downloadId));

        if (downloadedFile) {
          const filePath = path.join(downloadDir, downloadedFile);
          const stats = await fs.stat(filePath);

          // Update with completion
          io.to(`user-${userId}`).emit('download-complete', {
            downloadId,
            status: 'completed',
            filename: downloadedFile,
            size: stats.size,
            downloadUrl: `/uploads/videos/${downloadedFile}`
          });

          logger.info(`Téléchargement terminé: ${downloadedFile}`);
        }

      } catch (error) {
        logger.error('Erreur lors du téléchargement:', error);
        const io = req.app.get('io');
        io.to(`user-${userId}`).emit('download-error', {
          downloadId,
          status: 'failed',
          error: error.message
        });
      }
    };

    // Start download process
    downloadProcess();

  } catch (error) {
    logger.error('Erreur lors du téléchargement:', error);
    res.status(500).json({
      error: 'Erreur lors du téléchargement',
      message: error.message
    });
  }
});

// Get download status
router.get('/download/:downloadId', auth, async (req, res) => {
  try {
    const { downloadId } = req.params;
    const downloadDir = path.join(__dirname, '../uploads/videos');
    
    const files = await fs.readdir(downloadDir);
    const downloadedFile = files.find(file => file.startsWith(downloadId));

    if (downloadedFile) {
      const filePath = path.join(downloadDir, downloadedFile);
      const stats = await fs.stat(filePath);

      res.json({
        success: true,
        data: {
          downloadId,
          status: 'completed',
          filename: downloadedFile,
          size: stats.size,
          downloadUrl: `/uploads/videos/${downloadedFile}`
        }
      });
    } else {
      res.json({
        success: true,
        data: {
          downloadId,
          status: 'not_found'
        }
      });
    }

  } catch (error) {
    logger.error('Erreur lors de la vérification du téléchargement:', error);
    res.status(500).json({
      error: 'Erreur lors de la vérification du téléchargement',
      message: error.message
    });
  }
});

// Get user's download history
router.get('/history', auth, async (req, res) => {
  try {
    // This would typically come from a database
    // For now, we'll return mock data
    const history = [
      {
        id: '1',
        title: 'Example Video',
        platform: 'youtube',
        quality: '720p',
        size: '95 MB',
        downloadedAt: new Date().toISOString(),
        status: 'completed'
      }
    ];

    res.json({
      success: true,
      data: history
    });

  } catch (error) {
    logger.error('Erreur lors de la récupération de l\'historique:', error);
    res.status(500).json({
      error: 'Erreur lors de la récupération de l\'historique',
      message: error.message
    });
  }
});

module.exports = router;