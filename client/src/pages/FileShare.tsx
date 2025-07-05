import React, { useState, useRef, useCallback } from 'react';
import { 
  CloudArrowUpIcon, 
  DocumentIcon, 
  TrashIcon, 
  LinkIcon, 
  ClipboardIcon, 
  CheckCircleIcon,
  EyeIcon,
  CalendarIcon,
  LockClosedIcon,
  ShareIcon
} from '@heroicons/react/24/outline';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadProgress: number;
  uploadComplete: boolean;
  shareLink?: string;
  downloads: number;
  expiresAt: Date;
  isProtected: boolean;
}

export default function FileShare() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [copiedLink, setCopiedLink] = useState('');
  const [linkExpiry, setLinkExpiry] = useState('7'); // days
  const [passwordProtected, setPasswordProtected] = useState(false);
  const [password, setPassword] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, []);

  const handleFiles = (fileList: FileList) => {
    const newFiles: UploadedFile[] = Array.from(fileList).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      uploadProgress: 0,
      uploadComplete: false,
      downloads: 0,
      expiresAt: new Date(Date.now() + parseInt(linkExpiry) * 24 * 60 * 60 * 1000),
      isProtected: passwordProtected
    }));

    setFiles(prev => [...prev, ...newFiles]);
    
    // Simulate upload progress
    newFiles.forEach(file => {
      const interval = setInterval(() => {
        setFiles(prev => prev.map(f => 
          f.id === file.id 
            ? { ...f, uploadProgress: Math.min(f.uploadProgress + 10, 100) }
            : f
        ));
      }, 200);

      setTimeout(() => {
        clearInterval(interval);
        setFiles(prev => prev.map(f => 
          f.id === file.id 
            ? { 
                ...f, 
                uploadComplete: true, 
                uploadProgress: 100,
                shareLink: `https://losah.app/f/${file.id}`
              }
            : f
        ));
      }, 2000);
    });
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleCopyLink = async (link: string) => {
    try {
      await navigator.clipboard.writeText(link);
      setCopiedLink(link);
      setTimeout(() => setCopiedLink(''), 2000);
    } catch (err) {
      console.error('Erreur lors de la copie:', err);
    }
  };

  const handleRemoveFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return '🖼️';
    if (type.startsWith('video/')) return '🎥';
    if (type.startsWith('audio/')) return '🎵';
    if (type.includes('pdf')) return '📄';
    if (type.includes('doc')) return '📝';
    if (type.includes('sheet')) return '📊';
    return '📁';
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Partage de Fichiers
        </h1>
        <p className="text-gray-600">
          Partagez vos fichiers facilement avec des liens sécurisés et temporaires
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Drop Zone */}
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileInput}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="space-y-4">
              <div className="flex justify-center">
                <CloudArrowUpIcon className="h-12 w-12 text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Glissez-déposez vos fichiers ici
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  ou cliquez pour sélectionner des fichiers
                </p>
              </div>
              <div className="text-xs text-gray-500">
                Taille max: 100MB par fichier • Formats supportés: Tous
              </div>
            </div>
          </div>

          {/* Files List */}
          {files.length > 0 && (
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Fichiers ({files.length})
              </h3>
              <div className="space-y-4">
                {files.map((file) => (
                  <div key={file.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl">{getFileIcon(file.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900 truncate">{file.name}</h4>
                        {file.isProtected && (
                          <LockClosedIcon className="h-4 w-4 text-gray-500" />
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{formatFileSize(file.size)}</span>
                        <span>•</span>
                        <span>{file.downloads} téléchargements</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <CalendarIcon className="h-3 w-3" />
                          Expire le {file.expiresAt.toLocaleDateString()}
                        </span>
                      </div>
                      
                      {/* Progress Bar */}
                      {!file.uploadComplete && (
                        <div className="mt-2">
                          <div className="bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${file.uploadProgress}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {file.uploadProgress}% uploadé
                          </div>
                        </div>
                      )}
                      
                      {/* Share Link */}
                      {file.uploadComplete && file.shareLink && (
                        <div className="mt-3 flex items-center gap-2">
                          <input
                            type="text"
                            value={file.shareLink}
                            readOnly
                            className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm"
                          />
                          <button
                            onClick={() => handleCopyLink(file.shareLink!)}
                            className="btn btn-outline flex items-center gap-1 text-sm"
                          >
                            {copiedLink === file.shareLink ? (
                              <>
                                <CheckCircleIcon className="h-4 w-4 text-green-500" />
                                Copié
                              </>
                            ) : (
                              <>
                                <ClipboardIcon className="h-4 w-4" />
                                Copier
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <button
                      onClick={() => handleRemoveFile(file.id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Settings Sidebar */}
        <div className="space-y-6">
          {/* Share Settings */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Paramètres de partage
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiration du lien
                </label>
                <select
                  value={linkExpiry}
                  onChange={(e) => setLinkExpiry(e.target.value)}
                  className="input-field"
                >
                  <option value="1">1 jour</option>
                  <option value="7">7 jours</option>
                  <option value="30">30 jours</option>
                  <option value="90">90 jours</option>
                  <option value="365">1 an</option>
                </select>
              </div>
              
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={passwordProtected}
                    onChange={(e) => setPasswordProtected(e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Protection par mot de passe
                  </span>
                </label>
              </div>
              
              {passwordProtected && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mot de passe
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Entrez un mot de passe"
                    className="input-field"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Statistics */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Statistiques
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Fichiers partagés</span>
                <span className="font-medium text-gray-900">{files.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Téléchargements totaux</span>
                <span className="font-medium text-gray-900">
                  {files.reduce((sum, file) => sum + file.downloads, 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Espace utilisé</span>
                <span className="font-medium text-gray-900">
                  {formatFileSize(files.reduce((sum, file) => sum + file.size, 0))}
                </span>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Conseils de sécurité
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Utilisez des mots de passe forts pour les fichiers sensibles</li>
              <li>• Définissez une date d'expiration courte pour plus de sécurité</li>
              <li>• Vérifiez l'identité des destinataires avant de partager</li>
              <li>• Évitez de partager des informations confidentielles</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}