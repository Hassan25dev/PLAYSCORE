## 10. Système de notification

### 10.1 Types de notifications

PlayScore v3 implémente un système de notification complet pour informer les utilisateurs des événements importants. Les notifications sont adaptées au rôle de l'utilisateur.

#### Notifications pour les administrateurs

Les administrateurs reçoivent des notifications concernant :
- Les nouvelles soumissions de jeux
- Les commentaires signalés
- Les évaluations nécessitant une modération
- Les inscriptions de nouveaux utilisateurs

#### Notifications pour les développeurs

Les développeurs sont notifiés pour :
- L'approbation ou le rejet de leurs jeux
- Les nouveaux commentaires sur leurs jeux
- Les nouvelles évaluations de leurs jeux

#### Notifications pour les utilisateurs standard

Les utilisateurs standard reçoivent des notifications pour :
- L'approbation ou le rejet de leurs commentaires
- Les réponses à leurs commentaires
- Les sorties de jeux dans leur liste de souhaits

### 10.2 Canaux de distribution

Les notifications sont distribuées via plusieurs canaux :

#### Base de données

Les notifications sont stockées dans la base de données pour affichage dans l'interface :

```php
// Structure de la table notifications
Schema::create('notifications', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->string('type');
    $table->morphs('notifiable');
    $table->text('data');
    $table->timestamp('read_at')->nullable();
});
```

#### Email

Les notifications importantes sont également envoyées par email :

```php
// Extrait de la méthode via() dans une notification
public function via(object $notifiable): array
{
    return ['mail', 'database'];
}
```

### 10.3 Implémentation technique

#### Modèles de notification

Chaque type de notification est implémenté comme une classe dédiée :

```php
// Extrait de la classe GameApproved
class GameApproved extends Notification implements ShouldQueue
{
    use Queueable;

    protected $game;

    public function __construct(Jeu $game)
    {
        $this->game = $game;
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'game_approved',
            'game_id' => $this->game->id,
            'message' => 'notifications.messages.game_approved'
        ];
    }
}
```

#### Observateurs pour la création automatique de notifications

Des observateurs sont utilisés pour créer automatiquement des notifications lors de certains événements :

```php
// Extrait de l'observateur EvaluationObserver
public function created(Evaluation $evaluation)
{
    // Si l'évaluation nécessite une approbation
    if (!$evaluation->is_approved) {
        // Notifier les administrateurs
        $admins = User::where('role', 'admin')->get();
        Notification::send($admins, new NewEvaluationSubmission($evaluation));
    }
}
```

#### Contrôleur de notifications

Un contrôleur dédié gère les opérations liées aux notifications :

```php
// Extrait du contrôleur NotificationController
public function index(Request $request)
{
    $user = Auth::user();

    // Requête de base pour les notifications
    $query = DatabaseNotification::where('notifiable_id', $user->id)
                                ->where('notifiable_type', get_class($user))
                                ->orderBy('created_at', 'desc');

    // Pagination des résultats
    $notifications = $query->paginate(10);

    return response()->json($notifications);
}
```

### 10.4 Interface utilisateur des notifications

#### Centre de notifications

Un composant React affiche les notifications dans l'interface :

```jsx
// Extrait du composant NotificationCenter
export default function NotificationCenter({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { t } = useTranslation();

  // Récupération des notifications
  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  return (
    <div className="notification-center">
      <button className="notification-button" onClick={() => setIsOpen(!isOpen)}>
        <BellIcon />
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </button>
    </div>
  );
}
```

#### Traduction des messages de notification

Les messages de notification sont traduits selon la langue de l'utilisateur :

```jsx
// Extrait du rendu d'une notification
<p className="notification-message">
  {notification.data && notification.data.message ?
    t(notification.data.message) : 'Notification'
  }
</p>
```

## 11. Tests et qualité du code

### 11.1 Stratégie de test

PlayScore v3 adopte une approche de test complète pour garantir la qualité du code et prévenir les régressions.

#### Niveaux de test

La stratégie de test comprend plusieurs niveaux :

1. **Tests unitaires** : Validation des composants individuels
2. **Tests d'intégration** : Vérification des interactions entre composants
3. **Tests fonctionnels** : Validation des fonctionnalités complètes
4. **Tests de bout en bout** : Simulation du comportement utilisateur

#### Outils de test

Les principaux outils utilisés sont :

- **PHPUnit** : Tests backend (Laravel)
- **Jest** : Tests frontend (React)
- **Laravel Dusk** : Tests de bout en bout

### 11.2 Tests unitaires

Les tests unitaires vérifient le comportement des composants individuels.

#### Tests de modèles

```php
// Extrait d'un test unitaire pour le modèle User
public function test_user_can_have_developer_role()
{
    $user = User::factory()->create(['role' => 'developer']);
    $this->assertTrue($user->isDeveloper());
    $this->assertFalse($user->isAdmin());
}
```

#### Tests de contrôleurs

```php
// Extrait d'un test pour JeuController
public function test_index_returns_paginated_games()
{
    // Création de jeux de test
    Jeu::factory()->count(15)->create(['statut' => 'publie']);

    // Appel de la route
    $response = $this->get('/jeux');

    // Vérifications
    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('Jeux/Index')
        ->has('jeux.data')
    );
}
```

#### Tests de composants React

```jsx
// Extrait d'un test Jest pour GameCard
test('renders game title and rating', () => {
  const game = {
    id: 1,
    titre: 'Test Game',
    rating: 4.5,
    image_arriere_plan: 'test.jpg'
  };

  render(<GameCard game={game} />);

  expect(screen.getByText('Test Game')).toBeInTheDocument();
});
```

### 11.3 Tests d'intégration

Les tests d'intégration vérifient les interactions entre différents composants du système.

#### Test d'intégration pour la soumission de jeu

```php
// Extrait d'un test d'intégration pour la soumission de jeu
public function test_developer_can_submit_game()
{
    // Création d'un utilisateur développeur
    $developer = User::factory()->create(['role' => 'developer']);

    // Authentification
    $this->actingAs($developer);

    // Données de test
    $gameData = [
        'titre' => 'Nouveau Jeu Test',
        'description' => 'Description détaillée du jeu test...',
        'date_sortie' => '2023-01-01'
    ];

    // Soumission du jeu
    $response = $this->post('/developer/game-submissions', $gameData);

    // Vérifications
    $response->assertRedirect();
    $this->assertDatabaseHas('jeux', [
        'titre' => 'Nouveau Jeu Test'
    ]);
}
```

#### Test d'intégration pour l'approbation de jeu

```php
// Extrait d'un test d'intégration pour l'approbation de jeu
public function test_admin_can_approve_game()
{
    // Création d'un administrateur
    $admin = User::factory()->create(['role' => 'admin']);

    // Création d'un jeu en attente
    $game = Jeu::factory()->create([
        'statut' => 'en_attente',
        'developpeur_id' => User::factory()->create(['role' => 'developer'])->id
    ]);

    // Authentification
    $this->actingAs($admin);

    // Approbation du jeu
    $response = $this->post("/admin/game-approvals/{$game->id}/approve");

    // Vérifications
    $response->assertRedirect();
    $this->assertDatabaseHas('jeux', [
        'id' => $game->id,
        'statut' => 'publie'
    ]);
}
```

### 11.4 Assurance qualité

#### Analyse statique du code

L'analyse statique du code est réalisée avec plusieurs outils :

- **PHP_CodeSniffer** : Vérification du respect des standards de codage
- **PHPStan** : Analyse statique pour détecter les erreurs potentielles
- **ESLint** : Analyse du code JavaScript/React

```json
// Extrait de la configuration ESLint
{
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended"
  ],
  "rules": {
    "react/prop-types": "off",
    "no-unused-vars": "warn"
  }
}
```

#### Intégration continue

L'intégration continue est configurée avec GitHub Actions :

```yaml
# Extrait du workflow GitHub Actions
name: Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  laravel-tests:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Setup PHP
      uses: shivammathur/setup-php@v2
      with:
        php-version: '8.1'
    - name: Install Dependencies
      run: composer install --no-interaction
    - name: Generate key
      run: php artisan key:generate
    - name: Create Database
      run: touch database/database.sqlite
    - name: Execute tests
      env:
        DB_CONNECTION: sqlite
      run: vendor/bin/phpunit
```

## 12. Défis techniques et solutions

### 12.1 Problèmes rencontrés

#### Problème 1 : Soumissions de jeux n'apparaissant pas dans le dashboard admin

**Problème** : Les jeux soumis apparaissaient dans l'activité récente mais pas dans la section "À examiner" du dashboard administrateur.

**Cause** : La requête SQL filtrait incorrectement les jeux en fonction de leur statut.

**Solution** :
```php
// Correction de la requête dans GameApprovalController
public function index()
{
    $pendingGames = Jeu::where('statut', 'en_attente')
        ->whereNotNull('developpeur_id')
        ->orderBy('submitted_at', 'asc')
        ->paginate(10);

    return Inertia::render('Admin/GameApprovals/Index', [
        'pendingGames' => $pendingGames
    ]);
}
```

#### Problème 2 : Commentaires non modérés malgré is_approved=false

**Problème** : Les commentaires et évaluations apparaissaient dans le flux d'activité mais pas dans les files de modération.

**Cause** : L'observateur `CommentObserver` était référencé dans `AppServiceProvider` mais n'existait pas.

**Solution** :
```php
// Création de l'observateur manquant
class CommentObserver
{
    public function created(Comment $comment)
    {
        // Si le commentaire n'est pas approuvé
        if (!$comment->is_approved) {
            // Notifier les administrateurs
            $admins = User::where('role', 'admin')->get();
            Notification::send($admins, new NewCommentSubmission($comment));
        }
    }
}

// Enregistrement dans AppServiceProvider
public function boot()
{
    Comment::observe(CommentObserver::class);
}
```

#### Problème 3 : Erreur Chart.js "category is not a registered scale"

**Problème** : Le dashboard développeur affichait une erreur Chart.js indiquant que "category" n'était pas une échelle enregistrée.

**Cause** : Configuration incomplète de Chart.js.

**Solution** :
```jsx
// Importation et enregistrement des échelles nécessaires
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement
} from 'chart.js';

Chart.register(
  CategoryScale,
  LinearScale,
  BarElement
);
```

### 12.2 Solutions implémentées

#### Solution 1 : Système de file d'attente pour les notifications

Pour améliorer les performances lors de l'envoi de notifications, nous avons implémenté un système de file d'attente :

```php
// Configuration de la file d'attente dans .env
QUEUE_CONNECTION=database

// Implémentation de ShouldQueue dans les notifications
class GameApproved extends Notification implements ShouldQueue
{
    use Queueable;
    // ...
}

// Commande pour exécuter le worker de file d'attente
php artisan queue:work
```

#### Solution 2 : Middleware personnalisé pour la gestion des langues

Pour gérer efficacement les préférences linguistiques des utilisateurs :

```php
// Middleware SetLocale
public function handle(Request $request, Closure $next): Response
{
    // Priorité 1 : Préférence utilisateur
    if ($request->user() && $request->user()->language) {
        app()->setLocale($request->user()->language);
    }
    // Priorité 2 : Session
    else if (session()->has('locale')) {
        app()->setLocale(session('locale'));
    }

    return $next($request);
}
```

#### Solution 3 : Optimisation des requêtes avec eager loading

Pour améliorer les performances des requêtes, nous avons utilisé l'eager loading :

```php
// Avant optimisation
public function index()
{
    $jeux = Jeu::where('statut', 'publie')->paginate(12);
    return Inertia::render('Jeux/Index', ['jeux' => $jeux]);
}

// Après optimisation
public function index()
{
    $jeux = Jeu::with(['genres', 'developpeur'])
        ->where('statut', 'publie')
        ->paginate(12);
    return Inertia::render('Jeux/Index', ['jeux' => $jeux]);
}
```

### 12.3 Optimisations de performance

#### Lazy loading des composants React

Pour améliorer les temps de chargement initiaux, nous avons implémenté le lazy loading des composants :

```jsx
// Lazy loading avec React.lazy et Suspense
import React, { lazy, Suspense } from 'react';

const DeveloperDashboard = lazy(() => import('./Pages/Developer/Dashboard'));

// Dans le composant parent
<Suspense fallback={<LoadingComponent />}>
  <DeveloperDashboard {...props} />
</Suspense>
```

#### Mise en cache des traductions

Pour optimiser les performances des traductions :

```jsx
// Système de cache pour les traductions
const translationCache = {};

export function t(key, replacements = {}) {
  // Vérification du cache
  const cacheKey = `${currentLocale}:${key}`;
  if (Object.keys(replacements).length === 0 && translationCache[cacheKey]) {
    return translationCache[cacheKey];
  }

  // Traduction et mise en cache
  const result = /* logique de traduction */;

  if (typeof result === 'string' && Object.keys(replacements).length === 0) {
    translationCache[cacheKey] = result;
  }

  return result;
}
```

#### Pagination optimisée

Pour gérer efficacement les grandes quantités de données :

```php
// Pagination avec informations simplifiées
$jeux = Jeu::where('statut', 'publie')
    ->select(['id', 'titre', 'image_arriere_plan', 'rating', 'date_sortie'])
    ->with(['genres:id,nom', 'plateformes:id,nom'])
    ->paginate(12);
```

### 12.4 Sécurité

#### Protection contre les attaques CSRF

```php
// Middleware CSRF appliqué à toutes les routes web
protected $middlewareGroups = [
    'web' => [
        // ...
        \App\Http\Middleware\VerifyCsrfToken::class,
        // ...
    ],
];
```

#### Validation stricte des entrées utilisateur

```php
// Règles de validation strictes
public function rules(): array
{
    return [
        'titre' => ['required', 'string', 'min:3', 'max:100'],
        'description' => ['required', 'string', 'min:50'],
        'date_sortie' => ['required', 'date', 'before_or_equal:today'],
        'image' => ['required', 'image', 'mimes:jpeg,png,gif', 'max:5000'],
    ];
}
```

#### Protection contre les injections SQL

L'utilisation systématique de l'ORM Eloquent et des requêtes préparées protège contre les injections SQL :

```php
// Utilisation sécurisée de l'ORM
$jeux = Jeu::where('titre', 'LIKE', "%{$searchTerm}%")
    ->orWhere('description', 'LIKE', "%{$searchTerm}%")
    ->paginate(12);

// Pour les requêtes brutes, utilisation de requêtes préparées
$results = DB::select('SELECT * FROM jeux WHERE titre LIKE ?', ["%{$searchTerm}%"]);
```
