import React, { useState } from 'react';
import { 
  ChatBubbleLeftRightIcon, 
  ShareIcon, 
  ClipboardIcon, 
  CheckCircleIcon,
  SparklesIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline';

interface Template {
  id: string;
  name: string;
  content: string;
  category: string;
  emoji: string;
}

const templates: Template[] = [
  {
    id: '1',
    name: 'Motivation',
    content: 'Chaque jour est une nouvelle opportunité de briller ✨\n\n#Motivation #Inspiration #Réussite',
    category: 'Inspiration',
    emoji: '✨'
  },
  {
    id: '2',
    name: 'Entrepreneuriat',
    content: 'Entrepreneur, c\'est transformer les obstacles en opportunités 🚀\n\n#Entrepreneuriat #Business #Innovation',
    category: 'Business',
    emoji: '🚀'
  },
  {
    id: '3',
    name: 'Gratitude',
    content: 'Reconnaissant pour toutes les bénédictions de la vie 🙏\n\n#Gratitude #Bonheur #Vie',
    category: 'Personnel',
    emoji: '🙏'
  },
  {
    id: '4',
    name: 'Succès',
    content: 'Le succès commence par un rêve et se réalise par l\'action 💪\n\n#Succès #Determination #Objectifs',
    category: 'Inspiration',
    emoji: '💪'
  },
  {
    id: '5',
    name: 'Créativité',
    content: 'L\'imagination est plus importante que la connaissance 🎨\n\n#Créativité #Innovation #Art',
    category: 'Créatif',
    emoji: '🎨'
  },
  {
    id: '6',
    name: 'Travail d\'équipe',
    content: 'Ensemble, nous sommes plus forts 🤝\n\n#Équipe #Collaboration #Ensemble',
    category: 'Professionnel',
    emoji: '🤝'
  }
];

export default function WhatsAppShare() {
  const [message, setMessage] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Tous');

  const categories = ['Tous', 'Inspiration', 'Business', 'Personnel', 'Créatif', 'Professionnel'];

  const filteredTemplates = activeCategory === 'Tous' 
    ? templates 
    : templates.filter(template => template.category === activeCategory);

  const handleTemplateSelect = (template: Template) => {
    setMessage(template.content);
    setSelectedTemplate(template.id);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erreur lors de la copie:', err);
    }
  };

  const handleShare = () => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const generateRandomQuote = () => {
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
    setMessage(randomTemplate.content);
    setSelectedTemplate(randomTemplate.id);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Partage WhatsApp
        </h1>
        <p className="text-gray-600">
          Créez et partagez des statuts WhatsApp inspirants en quelques clics
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Message Editor */}
        <div className="space-y-6">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Créer votre message
              </h2>
              <button
                onClick={generateRandomQuote}
                className="btn btn-outline flex items-center gap-2"
              >
                <SparklesIcon className="h-4 w-4" />
                Inspiration
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Votre message
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Écrivez votre message inspirant..."
                  rows={8}
                  className="input-field resize-none"
                />
                <div className="mt-2 text-sm text-gray-500">
                  {message.length}/1000 caractères
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={handleCopy}
                  disabled={!message}
                  className="btn btn-outline flex items-center gap-2 flex-1"
                >
                  {copied ? (
                    <>
                      <CheckCircleIcon className="h-4 w-4 text-green-500" />
                      Copié !
                    </>
                  ) : (
                    <>
                      <ClipboardIcon className="h-4 w-4" />
                      Copier
                    </>
                  )}
                </button>
                
                <button
                  onClick={handleShare}
                  disabled={!message}
                  className="btn btn-primary flex items-center gap-2 flex-1"
                >
                  <PaperAirplaneIcon className="h-4 w-4" />
                  Partager
                </button>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Aperçu WhatsApp
            </h3>
            <div className="bg-gradient-to-b from-green-400 to-green-600 rounded-lg p-4">
              <div className="bg-white rounded-lg p-4 max-w-xs mx-auto">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    👤
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Vous</div>
                    <div className="text-xs text-gray-500">Maintenant</div>
                  </div>
                </div>
                <div className="bg-green-100 rounded-lg p-3 text-sm">
                  {message || 'Votre message apparaîtra ici...'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Templates */}
        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Templates inspirants
            </h2>
            
            {/* Category Filter */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      activeCategory === category
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Templates Grid */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                    selectedTemplate === template.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200'
                  }`}
                  onClick={() => handleTemplateSelect(template)}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">{template.emoji}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900">{template.name}</h4>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {template.category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {template.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Conseils pour un bon statut
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Utilisez des emojis pour rendre votre message plus attractif</li>
              <li>• Ajoutez des hashtags pertinents pour plus de visibilité</li>
              <li>• Gardez vos messages courts et percutants</li>
              <li>• Partagez des pensées positives et inspirantes</li>
              <li>• Engagez votre audience avec des questions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}