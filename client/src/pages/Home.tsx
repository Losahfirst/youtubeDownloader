import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowDownTrayIcon, 
  ChatBubbleLeftRightIcon, 
  ShareIcon, 
  ShieldCheckIcon, 
  BoltIcon, 
  DevicePhoneMobileIcon 
} from '@heroicons/react/24/outline';

const features = [
  {
    name: 'Téléchargement de vidéos',
    description: 'Téléchargez des vidéos depuis YouTube, Facebook et LinkedIn en haute qualité.',
    icon: ArrowDownTrayIcon,
    href: '/downloader',
    color: 'bg-primary-500'
  },
  {
    name: 'Partage WhatsApp',
    description: 'Générez et partagez des statuts WhatsApp personnalisés en un clic.',
    icon: ChatBubbleLeftRightIcon,
    href: '/whatsapp',
    color: 'bg-secondary-500'
  },
  {
    name: 'Partage de fichiers',
    description: 'Partagez vos fichiers facilement avec des liens sécurisés temporaires.',
    icon: ShareIcon,
    href: '/files',
    color: 'bg-accent-500'
  },
];

const benefits = [
  {
    name: 'Sécurisé',
    description: 'Vos données sont protégées avec le chiffrement de bout en bout.',
    icon: ShieldCheckIcon,
  },
  {
    name: 'Rapide',
    description: 'Des téléchargements ultra-rapides et une interface réactive.',
    icon: BoltIcon,
  },
  {
    name: 'Mobile-friendly',
    description: 'Utilisez Losah Builder sur tous vos appareils, partout.',
    icon: DevicePhoneMobileIcon,
  },
];

export default function Home() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary-500 to-secondary-500 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
        </div>
        <div className="mx-auto max-w-4xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Losah Builder
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              La plateforme tout-en-un pour télécharger des vidéos, partager sur WhatsApp et gérer vos fichiers. 
              Simple, rapide et sécurisé.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                to="/downloader"
                className="btn btn-primary text-lg px-8 py-3"
              >
                Commencer gratuitement
              </Link>
              <Link
                to="/dashboard"
                className="btn btn-outline text-lg px-8 py-3"
              >
                En savoir plus
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-primary-600">
              Fonctionnalités
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Tout ce dont vous avez besoin
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Trois outils puissants réunis dans une seule plateforme moderne et intuitive.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.name} className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                    <div className={`${feature.color} rounded-lg p-2`}>
                      <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    {feature.name}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto">{feature.description}</p>
                    <p className="mt-6">
                      <Link
                        to={feature.href}
                        className="text-sm font-semibold leading-6 text-primary-600 hover:text-primary-500"
                      >
                        Essayer maintenant <span aria-hidden="true">→</span>
                      </Link>
                    </p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Pourquoi choisir Losah Builder ?
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Une solution complète pensée pour votre productivité et votre sécurité.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {benefits.map((benefit) => (
                <div key={benefit.name} className="flex flex-col items-center text-center">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                    <div className="bg-primary-100 rounded-full p-3">
                      <benefit.icon className="h-8 w-8 text-primary-600" aria-hidden="true" />
                    </div>
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="text-lg font-semibold text-gray-900 mb-2">{benefit.name}</p>
                    <p className="flex-auto">{benefit.description}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-600">
        <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Prêt à commencer ?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-primary-100">
              Rejoignez des milliers d'utilisateurs qui font confiance à Losah Builder 
              pour leurs besoins de téléchargement et de partage.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                to="/downloader"
                className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-primary-600 shadow-sm hover:bg-primary-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Commencer maintenant
              </Link>
              <Link
                to="/dashboard"
                className="text-sm font-semibold leading-6 text-white hover:text-primary-100"
              >
                Voir le tableau de bord <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}