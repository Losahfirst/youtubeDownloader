# 🚀 Losah Builder

Une application web moderne tout-en-un pour télécharger des vidéos, partager sur WhatsApp et gérer vos fichiers facilement.

## ✨ Fonctionnalités

### 📹 Téléchargement de Vidéos
- **Plateformes supportées** : YouTube, Facebook, LinkedIn
- **Formats multiples** : Vidéo (360p, 720p, 1080p) et audio (MP3)
- **Prévisualisation** : Aperçu des vidéos avant téléchargement
- **Téléchargement en arrière-plan** : Suivi en temps réel avec Socket.IO
- **Historique** : Gestion complète des téléchargements

### 💬 Partage WhatsApp
- **Templates inspirants** : Plus de 50+ templates prêts à l'emploi
- **Catégories** : Motivation, Business, Personnel, Créatif, etc.
- **Génération automatique** : Création de liens WhatsApp instantanés
- **Prévisualisation** : Aperçu du message avant partage
- **Statistiques** : Suivi des partages et engagement

### 📁 Partage de Fichiers
- **Upload drag & drop** : Interface moderne et intuitive
- **Liens sécurisés** : Génération de liens temporaires
- **Protection par mot de passe** : Sécurité avancée
- **Expiration automatique** : Contrôle de la durée de vie des liens
- **Statistiques détaillées** : Suivi des téléchargements

### 🎯 Tableau de Bord
- **Statistiques en temps réel** : Vue d'ensemble de vos activités
- **Historique complet** : Toutes vos actions centralisées
- **Graphiques interactifs** : Visualisation des données
- **Actions rapides** : Accès direct aux fonctionnalités

## 🛠️ Technologies Utilisées

### Frontend
- **React 18** avec TypeScript
- **Tailwind CSS** pour le design
- **React Router** pour la navigation
- **Headless UI** pour les composants
- **Heroicons** pour les icônes
- **Axios** pour les requêtes API

### Backend
- **Node.js** avec Express.js
- **Socket.IO** pour le temps réel
- **JWT** pour l'authentification
- **Multer** pour l'upload de fichiers
- **youtube-dl-exec** pour le téléchargement
- **Winston** pour les logs
- **Bcryptjs** pour la sécurité

### Outils de Développement
- **Concurrently** pour lancer client/serveur
- **Nodemon** pour le développement
- **ESLint** pour la qualité du code
- **Jest** pour les tests

## 🚀 Installation et Configuration

### Prérequis
- **Node.js** (version 16 ou supérieure)
- **npm** ou **yarn**
- **youtube-dl** ou **yt-dlp** installé globalement

### Installation de youtube-dl
```bash
# Sur macOS
brew install youtube-dl

# Sur Ubuntu/Debian
sudo apt-get install youtube-dl

# Ou avec pip
pip install youtube-dl
```

### Installation du Projet
```bash
# Cloner le repository
git clone https://github.com/votre-username/losah-builder.git
cd losah-builder

# Installer toutes les dépendances
npm run install:all
```

### Configuration
```bash
# Copier les variables d'environnement
cp server/.env.example server/.env

# Éditer les variables selon vos besoins
nano server/.env
```

### Variables d'environnement importantes
```env
# Configuration JWT (OBLIGATOIRE)
JWT_SECRET=votre_cle_secrete_tres_longue_et_complexe

# Configuration serveur
PORT=5000
CLIENT_URL=http://localhost:3000

# Configuration email (optionnel)
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=votre-email@gmail.com
EMAIL_PASS=votre-mot-de-passe-app
```

## 🏃‍♂️ Lancement de l'Application

### Développement
```bash
# Lancer en mode développement (client + serveur)
npm run dev

# Ou séparément
npm run client:dev    # Frontend sur http://localhost:3000
npm run server:dev    # Backend sur http://localhost:5000
```

### Production
```bash
# Build du frontend
npm run build

# Lancement du serveur
npm start
```

## 📂 Structure du Projet

```
losah-builder/
├── client/                 # Frontend React
│   ├── public/            # Fichiers statiques
│   │   ├── components/    # Composants réutilisables
│   │   │   └── Layout/    # Header, Footer
│   │   ├── pages/         # Pages principales
│   │   │   ├── Home.tsx
│   │   │   ├── VideoDownloader.tsx
│   │   │   ├── WhatsAppShare.tsx
│   │   │   ├── FileShare.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   └── Settings.tsx
│   │   ├── App.tsx        # Composant principal
│   │   └── index.tsx      # Point d'entrée
│   ├── package.json
│   └── tailwind.config.js
├── server/                # Backend Node.js
│   ├── middleware/        # Middlewares Express
│   │   ├── auth.js        # Authentification JWT
│   │   └── errorHandler.js
│   ├── routes/            # Routes API
│   │   ├── auth.js        # Authentification
│   │   ├── video.js       # Téléchargement vidéos
│   │   ├── whatsapp.js    # Partage WhatsApp
│   │   ├── files.js       # Partage fichiers
│   │   └── user.js        # Gestion utilisateur
│   ├── utils/
│   │   └── logger.js      # Configuration Winston
│   ├── uploads/           # Fichiers uploadés
│   ├── logs/              # Fichiers de logs
│   ├── server.js          # Serveur principal
│   └── package.json
├── package.json           # Scripts principaux
└── README.md
```

## 🔐 API Endpoints

### Authentification
```
POST /api/auth/register    # Inscription
POST /api/auth/login       # Connexion
GET  /api/auth/me          # Profil utilisateur
POST /api/auth/logout      # Déconnexion
```

### Téléchargement Vidéos
```
POST /api/videos/analyze   # Analyser une URL
POST /api/videos/download  # Télécharger une vidéo
GET  /api/videos/history   # Historique des téléchargements
```

### Partage WhatsApp
```
GET  /api/whatsapp/templates      # Liste des templates
POST /api/whatsapp/share          # Générer un lien de partage
GET  /api/whatsapp/random         # Template aléatoire
```

### Partage de Fichiers
```
POST /api/files/upload            # Upload de fichiers
GET  /api/files/download/:id      # Télécharger un fichier
GET  /api/files/my-files          # Mes fichiers
DELETE /api/files/:id             # Supprimer un fichier
```

## 🎨 Interface Utilisateur

### Design System
- **Couleurs principales** : Bleu (#3B82F6), Vert (#10B981), Orange (#F59E0B)
- **Typography** : Inter (Headings), System fonts (Body)
- **Composants** : Design moderne avec Tailwind CSS
- **Responsive** : Mobile-first, optimisé pour tous les écrans

### Fonctionnalités UX
- **Navigation intuitive** : Menu responsive avec icônes
- **Feedback visuel** : Animations et transitions fluides
- **États de chargement** : Indicateurs de progression
- **Notifications** : Alertes et confirmations
- **Mode sombre** : Support prévu pour l'extension future

## 🔧 Développement

### Scripts Disponibles
```bash
npm run dev           # Lancement développement
npm run build         # Build production
npm run test          # Tests
npm run lint          # Linting
npm start             # Lancement production
```

### Ajout de Nouvelles Fonctionnalités
1. **Frontend** : Créer les composants dans `client/src/`
2. **Backend** : Ajouter les routes dans `server/routes/`
3. **API** : Documenter les nouveaux endpoints
4. **Tests** : Ajouter les tests correspondants

### Guidelines de Contribution
- Suivre les conventions de nommage
- Ajouter des commentaires pour le code complexe
- Tester les nouvelles fonctionnalités
- Mettre à jour la documentation

## 🚀 Déploiement

### Préparation
```bash
# Build du frontend
cd client && npm run build

# Variables d'environnement de production
NODE_ENV=production
```

### Plateformes Recommandées
- **Heroku** : Déploiement simple avec Procfile
- **Vercel** : Parfait pour le frontend
- **DigitalOcean** : VPS flexible
- **AWS** : Solution complète et scalable

### Configuration Nginx (optionnel)
```nginx
server {
    listen 80;
    server_name votre-domaine.com;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 📊 Monitoring et Logs

### Logs
- **Niveau** : Info, Warn, Error
- **Fichiers** : `server/logs/`
- **Format** : JSON structuré
- **Rotation** : Automatique (5MB max)

### Monitoring
- **Health Check** : `GET /health`
- **Métriques** : CPU, mémoire, espace disque
- **Alertes** : Erreurs critiques par email

## 🛡️ Sécurité

### Mesures Implémentées
- **Rate Limiting** : 100 requêtes/15min par IP
- **CORS** : Configuration stricte
- **Helmet** : Headers de sécurité
- **JWT** : Authentification sécurisée
- **Validation** : Entrées utilisateur
- **Sanitization** : Prévention XSS

### Bonnes Pratiques
- Mots de passe hashés avec bcrypt
- Variables d'environnement pour les secrets
- HTTPS en production (recommandé)
- Backups réguliers des données

## 🤝 Contribution

Les contributions sont les bienvenues ! Voici comment contribuer :

1. **Fork** le projet
2. **Créer** une branche (`git checkout -b feature/amazing-feature`)
3. **Commit** vos changements (`git commit -m 'Add amazing feature'`)
4. **Push** sur la branche (`git push origin feature/amazing-feature`)
5. **Ouvrir** une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

- **Email** : support@losahbuilder.com
- **Documentation** : [docs.losahbuilder.com](https://docs.losahbuilder.com)
- **Issues** : [GitHub Issues](https://github.com/votre-username/losah-builder/issues)

## 🎯 Roadmap

### Version 1.1
- [ ] Support Instagram et TikTok
- [ ] Mode sombre complet
- [ ] API publique avec clés
- [ ] Webhooks pour intégrations

### Version 1.2
- [ ] Application mobile (React Native)
- [ ] Intégration IA pour suggestions
- [ ] Système de plugins
- [ ] Analytics avancées

---

**Fait avec ❤️ par l'équipe Losah Builder**