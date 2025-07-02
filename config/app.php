<?php

use Illuminate\Support\Facades\Facade;
use Illuminate\Support\ServiceProvider;

return [

    /*
    |--------------------------------------------------------------------------
    | Application Name
    |--------------------------------------------------------------------------
    |
    | Ce nom est utilisé dans les notifications ou par d'autres packages.
    */
    'name' => env('APP_NAME', 'Game Rating System'),

    /*
    |--------------------------------------------------------------------------
    | Application Environment
    |--------------------------------------------------------------------------
    |
    | Détermine l'environnement d'exécution de votre application.
    */
    'env' => env('APP_ENV', 'local'), // Utilisez "local" pour le développement

    /*
    |--------------------------------------------------------------------------
    | Application Debug Mode
    |--------------------------------------------------------------------------
    |
    | Active ou désactive le mode debug pour afficher des messages d'erreur détaillés.
    */
    'debug' => (bool) env('APP_DEBUG', true), // Activer le debug en local

    /*
    |--------------------------------------------------------------------------
    | Application URL
    |--------------------------------------------------------------------------
    |
    | L'URL de base de votre application.
    */
    'url' => env('APP_URL', 'http://localhost'), // URL par défaut pour localhost

    'asset_url' => env('ASSET_URL'), // URL des assets (optionnel)

    /*
    |--------------------------------------------------------------------------
    | Application Timezone
    |--------------------------------------------------------------------------
    |
    | Fuseau horaire par défaut de l'application.
    */
    'timezone' => 'Europe/Paris', // Utilisez un fuseau horaire pertinent pour votre région

    /*
    |--------------------------------------------------------------------------
    | Application Locale Configuration
    |--------------------------------------------------------------------------
    |
    | Langue par défaut de l'application.
    */
    'locale' => env('APP_LOCALE', 'fr'), // Langue par défaut : français (ajout de APP_LOCALE dans .env)

    /*
    |--------------------------------------------------------------------------
    | Application Fallback Locale
    |--------------------------------------------------------------------------
    |
    | Langue de secours si la langue demandée n'est pas disponible.
    */
    'fallback_locale' => 'en', // Langue de secours : anglais

    /*
    |--------------------------------------------------------------------------
    | Faker Locale
    |--------------------------------------------------------------------------
    |
    | Localisation utilisée pour générer des données fictives avec Faker.
    */
    'faker_locale' => 'fr_FR', // Données fictives en français

    /*
    |--------------------------------------------------------------------------
    | Encryption Key
    |--------------------------------------------------------------------------
    |
    | Clé utilisée pour chiffrer les données sensibles.
    */
    'key' => env('APP_KEY'), // Clé générée automatiquement lors de la création du projet
    'cipher' => 'AES-256-CBC',

    /*
    |--------------------------------------------------------------------------
    | Maintenance Mode Driver
    |--------------------------------------------------------------------------
    |
    | Mécanisme utilisé pour gérer le mode maintenance.
    */
    'maintenance' => [
        'driver' => 'file', // Stockage du statut maintenance dans un fichier
    ],

    /*
    |--------------------------------------------------------------------------
    | Autoloaded Service Providers
    |--------------------------------------------------------------------------
    |
    | Liste des providers de services qui sont chargés automatiquement.
    */
    'providers' => ServiceProvider::defaultProviders()->merge([
        /*
         * Package Service Providers...
         */
        Barryvdh\DomPDF\ServiceProvider::class, // Ajout pour la génération de PDF
        Laravel\Sanctum\SanctumServiceProvider::class, // Authentification API (si nécessaire)

        /*
         * Application Service Providers...
         */
        App\Providers\AppServiceProvider::class,
        App\Providers\AuthServiceProvider::class,
        App\Providers\EventServiceProvider::class,
        App\Providers\RouteServiceProvider::class,
    ])->toArray(),

    /*
    |--------------------------------------------------------------------------
    | Class Aliases
    |--------------------------------------------------------------------------
    |
    | Alias de classes pour simplifier leur utilisation.
    */
    'aliases' => Facade::defaultAliases()->merge([
        'PDF' => Barryvdh\DomPDF\Facade\Pdf::class, // Alias pour DomPDF
    ])->toArray(),
];