## 5. Système d'authentification et gestion des rôles

### 5.1 Architecture du système d'authentification

PlayScore v3 utilise le système d'authentification intégré de Laravel, enrichi de fonctionnalités supplémentaires pour répondre aux besoins spécifiques de l'application. L'architecture d'authentification comprend plusieurs composants clés :

#### Modèle User
Le modèle `User` étend la classe `Authenticatable` de Laravel et implémente l'interface `MustVerifyEmail` pour la vérification des adresses email :

```php
// Modèle User avec vérification d'email
class User extends Authenticatable implements MustVerifyEmailContract
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = ['name', 'email', 'password', 'role', 'language'];
    protected $hidden = ['password', 'remember_token'];
}
```

#### Contrôleurs d'authentification
Les contrôleurs spécialisés gèrent les différentes actions liées à l'authentification :

```php
// Contrôleur gérant les sessions d'authentification
class AuthenticatedSessionController extends Controller
{
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();
        $request->session()->regenerate();
        return redirect()->intended(RouteServiceProvider::HOME);
    }
}
```

#### Middleware d'authentification
Des middleware spécifiques contrôlent l'accès aux routes protégées :

```php
// Middleware redirigeant les utilisateurs déjà authentifiés
class RedirectIfAuthenticated
{
    public function handle(Request $request, Closure $next, string ...$guards): Response
    {
        foreach ($guards as $guard) {
            if (Auth::guard($guard)->check()) {
                return redirect(RouteServiceProvider::HOME);
            }
        }
        return $next($request);
    }
}
```

### 5.2 Implémentation des rôles utilisateur

PlayScore v3 implémente un système de rôles à deux niveaux :

1. **Rôle principal** : Stocké directement dans la colonne `role` de la table `users`
2. **Rôles secondaires** : Gérés via une relation many-to-many avec la table `roles`

Cette approche hybride permet une vérification rapide du rôle principal tout en offrant la flexibilité d'attribuer plusieurs rôles à un utilisateur.

#### Définition des rôles
Les rôles principaux sont définis comme une énumération dans la migration de la table `users` :

```php
// Définition des rôles principaux comme énumération
Schema::create('users', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->enum('role', ['admin', 'user', 'developer'])->default('user');
});
```

Les rôles secondaires sont définis dans la table `roles` :

```php
// Table des rôles secondaires
Schema::create('roles', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('slug')->unique();
    $table->timestamps();
});
```

#### Attribution des rôles
Les rôles sont attribués aux utilisateurs via la table pivot `role_user` :

```php
// Table pivot pour la relation many-to-many entre rôles et utilisateurs
Schema::create('role_user', function (Blueprint $table) {
    $table->foreignId('role_id')->constrained()->onDelete('cascade');
    $table->foreignId('user_id')->constrained()->onDelete('cascade');
    $table->primary(['role_id', 'user_id']);
});
```

### 5.3 Gestion des permissions

Le système de permissions permet un contrôle granulaire des actions autorisées pour chaque rôle :

#### Modèle Permission
```php
// Modèle Permission avec relation many-to-many vers les rôles
class Permission extends Model
{
    protected $fillable = ['name', 'slug', 'description'];

    public function roles()
    {
        return $this->belongsToMany(Role::class);
    }
}
```

#### Relation entre rôles et permissions
Les permissions sont attribuées aux rôles via une table pivot :

```php
// Table pivot pour la relation many-to-many entre permissions et rôles
Schema::create('permission_role', function (Blueprint $table) {
    $table->foreignId('permission_id')->constrained()->onDelete('cascade');
    $table->foreignId('role_id')->constrained()->onDelete('cascade');
    $table->primary(['permission_id', 'role_id']);
});
```

#### Initialisation des permissions
Les permissions sont initialisées via un seeder :

```php
// Seeder pour initialiser les permissions et les attribuer aux rôles
class PermissionSeeder extends Seeder
{
    public function run()
    {
        // Création des permissions de base
        $permissions = [
            ['name' => 'Voir les jeux', 'slug' => 'view-games'],
            ['name' => 'Créer des jeux', 'slug' => 'create-games']
        ];

        // Attribution des permissions aux rôles
        $adminRole = Role::where('slug', 'admin')->first();
        $adminRole->permissions()->sync(Permission::all());
    }
}
```

### 5.4 Sécurisation des routes et des contrôleurs

La sécurisation des routes est assurée par des middleware spécialisés :

#### Middleware de vérification des rôles
```php
// Middleware vérifiant si l'utilisateur possède un rôle spécifique
class CheckRole
{
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        if (!$request->user()) {
            return redirect()->route('login');
        }

        foreach ($roles as $role) {
            if ($request->user()->role === $role) {
                return $next($request);
            }
        }

        return redirect()->route('dashboard');
    }
}
```

#### Middleware de vérification des permissions
```php
// Middleware vérifiant si l'utilisateur possède une permission spécifique
class CheckPermission
{
    public function handle(Request $request, Closure $next, ...$permissions): Response
    {
        if (!$request->user()) {
            return redirect()->route('login');
        }

        foreach ($permissions as $permission) {
            if ($request->user()->hasPermission($permission)) {
                return $next($request);
            }
        }

        return redirect()->route('dashboard');
    }
}
```

#### Application des middleware aux routes
```php
// Application des middleware de rôle aux groupes de routes
// Routes administrateur
Route::middleware(['auth', 'verified', 'role:admin'])
    ->prefix('admin')->name('admin.')->group(function () {
        Route::resource('game-approvals', GameApprovalController::class);
        Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    });

// Routes développeur
Route::middleware(['auth', 'verified', 'role:developer,admin'])
    ->prefix('developer')->name('developer.')->group(function () {
        Route::resource('game-submissions', GameSubmissionController::class);
    });
```

### 5.5 Vérification d'email et récupération de mot de passe

PlayScore v3 implémente un système complet de vérification d'email et de récupération de mot de passe :

#### Vérification d'email
La vérification d'email est gérée par le trait `MustVerifyEmail` de Laravel, avec une personnalisation de la notification :

```php
// Notification personnalisée pour la vérification d'email
class CustomVerifyEmail extends VerifyEmail
{
    public function toMail($notifiable)
    {
        $verificationUrl = $this->verificationUrl($notifiable);
        return (new MailMessage)
            ->subject(__('Vérifiez votre adresse e-mail'))
            ->action(__('Vérifier l\'adresse e-mail'), $verificationUrl);
    }
}
```

#### Récupération de mot de passe
La récupération de mot de passe utilise le système intégré de Laravel, avec des vues personnalisées :

```php
// Contrôleur gérant la réinitialisation de mot de passe
class PasswordResetLinkController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Auth/ForgotPassword', [
            'status' => session('status'),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate(['email' => 'required|email']);
        $status = Password::sendResetLink($request->only('email'));
        return back()->with('status', __($status));
    }
}
```

## 6. Support multilingue

### 6.1 Architecture de l'internationalisation

PlayScore v3 implémente un système d'internationalisation complet, permettant de basculer entre le français et l'anglais. L'architecture multilingue repose sur plusieurs composants :

#### Configuration de base
La configuration des langues est définie dans le fichier `config/app.php` :

```php
// Configuration des langues dans config/app.php
return [
    'locale' => env('APP_LOCALE', 'fr'), // Langue par défaut : français
    'fallback_locale' => 'en',           // Langue de secours : anglais
    'faker_locale' => 'fr_FR',           // Données fictives en français
];
```

#### Stockage des traductions
Les traductions sont stockées dans deux formats :

1. **Fichiers PHP** (côté serveur) : `resources/lang/{locale}/{fichier}.php`
2. **Fichiers JSON** (côté client) : `resources/js/lang/{locale}.json`

### 6.2 Implémentation côté serveur

#### Middleware de définition de la locale
Un middleware personnalisé gère la définition de la locale active :

```php
// Middleware définissant la langue active selon les préférences utilisateur
class SetLocale
{
    public function handle(Request $request, Closure $next): Response
    {
        // Priorité 1 : Préférence utilisateur connecté
        if ($request->user() && $request->user()->language) {
            app()->setLocale($request->user()->language);
        }
        // Priorité 2 : Session
        else if (session()->has('locale')) {
            app()->setLocale(session('locale'));
        }

        return $next($request);
    }
}
```

#### Enregistrement du middleware
Le middleware est enregistré dans `app/Http/Kernel.php` :

```php
// Enregistrement du middleware dans le groupe web
protected $middlewareGroups = [
    'web' => [
        \App\Http\Middleware\EncryptCookies::class,
        \App\Http\Middleware\SetLocale::class,
        // autres middleware...
    ],
];
```

#### Route de changement de langue
Une route dédiée permet de changer la langue de l'application :

```php
// Route pour changer la langue de l'application
Route::post('/language-switch', function (Request $request) {
    $request->validate([
        'language' => 'required|string|in:en,fr',
    ]);

    // Stockage de la locale en session
    session(['locale' => $request->language]);
    app()->setLocale($request->language);

    return redirect()->back()->with('locale_changed', true);
})->name('language.switch');
```

#### Utilisation des traductions dans les vues Blade
Dans les vues Blade, les traductions sont utilisées via la fonction `__()` :

```php
<h1>{{ __('admin.dashboard.title') }}</h1>
<p>{{ __('admin.dashboard.welcome') }}</p>
```

#### Exemple de fichier de traduction PHP
Fichier `resources/lang/fr/admin.php` :

```php
// Fichier de traduction français pour l'administration
return [
    'navigation' => [
        'title' => 'Admin',
    ],
    'dashboard' => [
        'title' => 'Admin',
        'welcome' => 'Bienvenue',
        'statistics' => 'Statistiques',
    ],
];
```

### 6.3 Implémentation côté client

#### Helper de traduction JavaScript
Un helper de traduction personnalisé a été créé pour gérer les traductions côté client :

```javascript
// resources/js/lang/translationHelper.js
import en from './en.json';
import fr from './fr.json';
import React from 'react';

const translations = { en, fr };
let currentLocale = 'fr'; // Default to French
const translationCache = {};

// Fonction principale de traduction
export function t(key, replacements = {}) {
    // Vérification du cache
    const cacheKey = `${currentLocale}:${key}`;
    if (Object.keys(replacements).length === 0 && translationCache[cacheKey]) {
        return translationCache[cacheKey];
    }

    // Récupération de la traduction
    const currentTranslations = translations[currentLocale] || {};
    const parts = key.split('.');
    let result = currentTranslations;

    // Navigation dans l'objet de traductions
    for (const part of parts) {
        result = result?.[part];
        if (result === undefined) break;
    }

    return result || key;
}

// Hook React pour utiliser les traductions
export function useTranslation() {
    const [locale, setLocaleState] = React.useState(currentLocale);

    return {
        t: React.useCallback((key, replacements = {}) => {
            return t(key, replacements);
        }, [locale]),
        locale
    };
}
```

#### Utilisation dans les composants React
Les traductions sont utilisées dans les composants React via le hook `useTranslation` :

```jsx
import React from 'react';
import { useTranslation } from '../../lang/translationHelper';

export default function GameCard({ game }) {
    const { t } = useTranslation();

    return (
        <div className="game-card">
            <h2>{game.titre}</h2>
            <p>{t('game_card.release_date')}: {game.date_sortie}</p>
            <p>{t('game_card.rating')}: {game.rating}/5</p>
        </div>
    );
}
```

#### Exemple de fichier de traduction JSON
Fichier `resources/js/lang/fr.json` :

```json
{
  "welcome": {
    "hero_title": "Découvrez, évaluez et critiquez les meilleurs jeux",
    "hero_subtitle": "Votre place pour des critiques de jeux honnêtes",
    "browse_games": "Parcourir la liste des jeux",
    "join_community": "Rejoignez la communauté"
  },
  "header": {
    "search_placeholder": "Rechercher un jeu...",
    "home": "Accueil",
    "games": "Jeux",
    "login": "Connexion",
    "logout": "Déconnexion"
  }
}
```

### 6.4 Gestion des préférences linguistiques des utilisateurs

Les préférences linguistiques des utilisateurs sont stockées dans la base de données et dans la session :

#### Stockage dans la base de données
La table `users` inclut une colonne `language` pour stocker la préférence linguistique :

```php
Schema::create('users', function (Blueprint $table) {
    // ...
    $table->string('language')->nullable();
    // ...
});
```

#### Mise à jour de la préférence linguistique
La préférence linguistique peut être mise à jour via le profil utilisateur :

```php
class ProfileController extends Controller
{
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        // Update language preference
        if ($request->has('language')) {
            $request->user()->language = $request->language;
            app()->setLocale($request->language);
            session(['locale' => $request->language]);
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }
}
```

#### Composant de sélection de langue
Un composant React permet de changer la langue de l'interface :

```jsx
import React from 'react';
import { useTranslation } from '../lang/translationHelper';
import axios from 'axios';

export default function LanguageSwitcher() {
    const { t, locale, setLocale } = useTranslation();

    const handleLanguageChange = async (newLocale) => {
        if (newLocale === locale) return;

        try {
            await axios.post('/language-switch', { language: newLocale });
            setLocale(newLocale);
            window.location.reload();
        } catch (error) {
            console.error('Failed to switch language:', error);
        }
    };

    return (
        <div className="language-switcher">
            <button className={locale === 'fr' ? 'active' : ''}
                    onClick={() => handleLanguageChange('fr')}>FR</button>
            <button className={locale === 'en' ? 'active' : ''}
                    onClick={() => handleLanguageChange('en')}>EN</button>
        </div>
    );
}
```

### 6.5 Défis et solutions

L'implémentation du support multilingue a présenté plusieurs défis :

#### Défi 1 : Synchronisation des traductions serveur/client
**Solution** : Création d'un script d'extraction des clés de traduction pour assurer la cohérence entre les fichiers PHP et JSON.

#### Défi 2 : Performances avec de nombreuses clés de traduction
**Solution** : Mise en place d'un système de cache côté client pour éviter de recalculer les traductions fréquemment utilisées.

#### Défi 3 : Gestion des pluriels et des formes complexes
**Solution** : Utilisation de fonctions de traduction spécialisées pour les cas complexes, avec support des variables de remplacement.

#### Défi 4 : Mise à jour de l'interface sans rechargement
**Solution** : Utilisation d'événements personnalisés pour notifier les composants React des changements de langue.
