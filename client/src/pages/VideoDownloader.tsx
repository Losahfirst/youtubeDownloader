import React, { useState } from 'react';
import { 
  ArrowDownTrayIcon, 
  PlayIcon, 
  ClockIcon, 
  EyeIcon,
  LinkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface VideoInfo {
  title: string;
  thumbnail: string;
  duration: string;
  views: string;
  platform: 'youtube' | 'facebook' | 'linkedin';
  formats: Array<{
    quality: string;
    format: string;
    size: string;
  }>;
}

export default function VideoDownloader() {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState('');
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!url) {
      setError('Veuillez entrer une URL valide');
      return;
    }

    setIsAnalyzing(true);
    setError('');
    
    try {
      // Simulation de l'analyse
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Données simulées
      setVideoInfo({
        title: 'Titre de la vidéo exemple',
        thumbnail: '/api/placeholder/400/300',
        duration: '10:32',
        views: '1.2M',
        platform: 'youtube',
        formats: [
          { quality: '1080p', format: 'MP4', size: '150 MB' },
          { quality: '720p', format: 'MP4', size: '95 MB' },
          { quality: '480p', format: 'MP4', size: '60 MB' },
          { quality: 'Audio', format: 'MP3', size: '12 MB' },
        ]
      });
      setSelectedFormat('720p');
    } catch (err) {
      setError('Erreur lors de l\'analyse de la vidéo');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDownload = async () => {
    if (!selectedFormat) {
      setError('Veuillez sélectionner un format');
      return;
    }

    setIsDownloading(true);
    setDownloadProgress(0);
    
    // Simulation du téléchargement
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsDownloading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'youtube': return '📺';
      case 'facebook': return '📘';
      case 'linkedin': return '💼';
      default: return '🎥';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Téléchargeur de Vidéos
        </h1>
        <p className="text-gray-600">
          Téléchargez des vidéos depuis YouTube, Facebook et LinkedIn en haute qualité
        </p>
      </div>

      {/* URL Input */}
      <div className="card p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
              URL de la vidéo
            </label>
            <input
              type="url"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className="input-field"
              disabled={isAnalyzing}
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="btn btn-primary flex items-center gap-2 w-full sm:w-auto"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Analyse...
                </>
              ) : (
                <>
                  <LinkIcon className="h-4 w-4" />
                  Analyser
                </>
              )}
            </button>
          </div>
        </div>
        
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
            <span className="text-red-700">{error}</span>
          </div>
        )}
      </div>

      {/* Video Preview */}
      {videoInfo && (
        <div className="card p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              <div className="relative">
                <img
                  src={videoInfo.thumbnail}
                  alt={videoInfo.title}
                  className="w-full h-48 object-cover rounded-lg bg-gray-200"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <PlayIcon className="h-12 w-12 text-white" />
                </div>
              </div>
            </div>
            
            <div className="md:w-2/3">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{getPlatformIcon(videoInfo.platform)}</span>
                <span className="text-sm font-medium text-gray-500 capitalize">
                  {videoInfo.platform}
                </span>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {videoInfo.title}
              </h3>
              
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
                <div className="flex items-center gap-1">
                  <ClockIcon className="h-4 w-4" />
                  {videoInfo.duration}
                </div>
                <div className="flex items-center gap-1">
                  <EyeIcon className="h-4 w-4" />
                  {videoInfo.views} vues
                </div>
              </div>
              
              {/* Format Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Choisissez le format
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {videoInfo.formats.map((format) => (
                    <label
                      key={format.quality}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedFormat === format.quality
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="format"
                        value={format.quality}
                        checked={selectedFormat === format.quality}
                        onChange={(e) => setSelectedFormat(e.target.value)}
                        className="sr-only"
                      />
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium text-gray-900">
                            {format.quality}
                          </div>
                          <div className="text-sm text-gray-500">
                            {format.format}
                          </div>
                        </div>
                        <div className="text-sm font-medium text-gray-600">
                          {format.size}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Download Button */}
              <button
                onClick={handleDownload}
                disabled={isDownloading || !selectedFormat}
                className="btn btn-primary w-full flex items-center justify-center gap-2"
              >
                {isDownloading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Téléchargement... {downloadProgress}%
                  </>
                ) : (
                  <>
                    <ArrowDownTrayIcon className="h-4 w-4" />
                    Télécharger
                  </>
                )}
              </button>
              
              {/* Progress Bar */}
              {isDownloading && (
                <div className="mt-4">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${downloadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              {downloadProgress === 100 && !isDownloading && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                  <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  <span className="text-green-700">Téléchargement terminé !</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Conseils d'utilisation
        </h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• Copiez l'URL complète de la vidéo depuis votre navigateur</li>
          <li>• Choisissez la qualité en fonction de votre connexion internet</li>
          <li>• Les formats audio sont parfaits pour les podcasts et musiques</li>
          <li>• Respectez les droits d'auteur lors du téléchargement</li>
        </ul>
      </div>
    </div>
  );
}