import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <div className="text-2xl font-bold gradient-bg bg-clip-text text-transparent">
              Losah Builder
            </div>
            <p className="text-gray-400 text-base">
              Votre plateforme tout-en-un pour télécharger des vidéos, partager sur WhatsApp et gérer vos fichiers facilement.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">
                  Fonctionnalités
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link to="/downloader" className="text-base text-gray-400 hover:text-white transition-colors">
                      Téléchargeur de vidéos
                    </Link>
                  </li>
                  <li>
                    <Link to="/whatsapp" className="text-base text-gray-400 hover:text-white transition-colors">
                      Partage WhatsApp
                    </Link>
                  </li>
                  <li>
                    <Link to="/files" className="text-base text-gray-400 hover:text-white transition-colors">
                      Partage de fichiers
                    </Link>
                  </li>
                  <li>
                    <Link to="/dashboard" className="text-base text-gray-400 hover:text-white transition-colors">
                      Tableau de bord
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">
                  Support
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <a href="#" className="text-base text-gray-400 hover:text-white transition-colors">
                      Centre d'aide
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-base text-gray-400 hover:text-white transition-colors">
                      FAQ
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-base text-gray-400 hover:text-white transition-colors">
                      Contact
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-base text-gray-400 hover:text-white transition-colors">
                      Statut du service
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">
                  Légal
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <a href="#" className="text-base text-gray-400 hover:text-white transition-colors">
                      Politique de confidentialité
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-base text-gray-400 hover:text-white transition-colors">
                      Conditions d'utilisation
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-base text-gray-400 hover:text-white transition-colors">
                      Cookies
                    </a>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">
                  Suivez-nous
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <a href="#" className="text-base text-gray-400 hover:text-white transition-colors">
                      Twitter
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-base text-gray-400 hover:text-white transition-colors">
                      LinkedIn
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-base text-gray-400 hover:text-white transition-colors">
                      Facebook
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-800 pt-8">
          <p className="text-base text-gray-400 text-center">
            &copy; 2024 Losah Builder. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}