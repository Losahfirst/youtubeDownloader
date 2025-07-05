import React, { useState } from 'react';
import { 
  ChartBarIcon, 
  ArrowDownTrayIcon, 
  ShareIcon, 
  ChatBubbleLeftRightIcon,
  EyeIcon,
  ClockIcon,
  TrendingUpIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

interface ActivityItem {
  id: string;
  type: 'video' | 'whatsapp' | 'file';
  title: string;
  description: string;
  date: Date;
  status: 'success' | 'pending' | 'failed';
}

const activities: ActivityItem[] = [
  {
    id: '1',
    type: 'video',
    title: 'Vidéo YouTube téléchargée',
    description: 'How to Build a React App - Tutorial',
    date: new Date(2024, 0, 15, 14, 30),
    status: 'success'
  },
  {
    id: '2',
    type: 'whatsapp',
    title: 'Statut WhatsApp partagé',
    description: 'Message motivationnel #Inspiration',
    date: new Date(2024, 0, 15, 12, 15),
    status: 'success'
  },
  {
    id: '3',
    type: 'file',
    title: 'Fichier partagé',
    description: 'presentation.pdf (2.3 MB)',
    date: new Date(2024, 0, 14, 16, 45),
    status: 'success'
  },
  {
    id: '4',
    type: 'video',
    title: 'Analyse vidéo échouée',
    description: 'URL invalide ou vidéo privée',
    date: new Date(2024, 0, 14, 10, 20),
    status: 'failed'
  },
  {
    id: '5',
    type: 'file',
    title: 'Upload en cours',
    description: 'video_project.mp4 (150 MB)',
    date: new Date(2024, 0, 14, 9, 10),
    status: 'pending'
  }
];

const stats = {
  totalDownloads: 142,
  totalShares: 87,
  totalWhatsApp: 65,
  totalFiles: 23,
  thisWeek: {
    downloads: 12,
    shares: 8,
    whatsapp: 5
  }
};

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState('7days');
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <ArrowDownTrayIcon className="h-5 w-5 text-primary-600" />;
      case 'whatsapp':
        return <ChatBubbleLeftRightIcon className="h-5 w-5 text-green-600" />;
      case 'file':
        return <ShareIcon className="h-5 w-5 text-blue-600" />;
      default:
        return <ChartBarIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'success':
        return 'Réussi';
      case 'pending':
        return 'En cours';
      case 'failed':
        return 'Échoué';
      default:
        return 'Inconnu';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Tableau de bord
        </h1>
        <p className="text-gray-600">
          Suivez vos activités et statistiques en temps réel
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Téléchargements</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalDownloads}</p>
              <p className="text-sm text-green-600">+{stats.thisWeek.downloads} cette semaine</p>
            </div>
            <div className="p-3 bg-primary-100 rounded-full">
              <ArrowDownTrayIcon className="h-6 w-6 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Partages WhatsApp</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalWhatsApp}</p>
              <p className="text-sm text-green-600">+{stats.thisWeek.whatsapp} cette semaine</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <ChatBubbleLeftRightIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Fichiers partagés</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalFiles}</p>
              <p className="text-sm text-green-600">+{stats.thisWeek.shares} cette semaine</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <ShareIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total interactions</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalShares}</p>
              <p className="text-sm text-gray-500">Toutes plateformes</p>
            </div>
            <div className="p-3 bg-accent-100 rounded-full">
              <TrendingUpIcon className="h-6 w-6 text-accent-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Activity Feed */}
        <div className="lg:col-span-2">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Activité récente
              </h2>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="text-sm border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="7days">7 derniers jours</option>
                <option value="30days">30 derniers jours</option>
                <option value="90days">90 derniers jours</option>
              </select>
            </div>

            <div className="space-y-4">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className={`flex items-start gap-4 p-4 rounded-lg border transition-colors cursor-pointer ${
                    selectedActivity === activity.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedActivity(activity.id)}
                >
                  <div className="flex-shrink-0 mt-1">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-medium text-gray-900">
                        {activity.title}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(activity.status)}`}>
                        {getStatusLabel(activity.status)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {activity.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <ClockIcon className="h-3 w-3" />
                      {activity.date.toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <button className="btn btn-outline">
                Voir plus d'activités
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions & Stats */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Actions rapides
            </h3>
            <div className="space-y-3">
              <button className="btn btn-primary w-full flex items-center justify-center gap-2">
                <ArrowDownTrayIcon className="h-4 w-4" />
                Télécharger une vidéo
              </button>
              <button className="btn btn-secondary w-full flex items-center justify-center gap-2">
                <ChatBubbleLeftRightIcon className="h-4 w-4" />
                Créer un statut WhatsApp
              </button>
              <button className="btn btn-accent w-full flex items-center justify-center gap-2">
                <ShareIcon className="h-4 w-4" />
                Partager un fichier
              </button>
            </div>
          </div>

          {/* Usage Chart */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Utilisation cette semaine
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Téléchargements</span>
                  <span>{stats.thisWeek.downloads}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full"
                    style={{ width: `${(stats.thisWeek.downloads / 20) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Partages WhatsApp</span>
                  <span>{stats.thisWeek.whatsapp}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${(stats.thisWeek.whatsapp / 15) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Fichiers partagés</span>
                  <span>{stats.thisWeek.shares}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${(stats.thisWeek.shares / 10) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Conseil du jour
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              Utilisez des hashtags pertinents dans vos statuts WhatsApp pour augmenter leur portée et engagement.
            </p>
            <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              Voir plus de conseils →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}