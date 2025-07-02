# Rapport Technique : PlayScore v3

## 1. Introduction

### 1.1 Présentation du projet

PlayScore est une plateforme web dédiée à la découverte, l'évaluation et la critique de jeux vidéo. Cette application permet aux utilisateurs de consulter une vaste bibliothèque de jeux, de lire et publier des critiques, et de suivre leurs activités de jeu. La version 3 (v3) représente une évolution majeure de la plateforme, avec une refonte complète de l'architecture technique et l'ajout de nombreuses fonctionnalités avancées.

Le projet PlayScore v3 a été développé en utilisant des technologies modernes et robustes :
- **Backend** : Laravel 10 (framework PHP)
- **Frontend** : React avec Inertia.js
- **Base de données** : MySQL
- **Outils complémentaires** : Vite, Tailwind CSS, Chart.js

### 1.2 Objectifs et public cible

Les objectifs principaux de PlayScore v3 sont :
- Offrir une plateforme intuitive pour découvrir et évaluer des jeux vidéo
- Permettre aux développeurs indépendants de soumettre leurs jeux
- Créer une communauté active autour des critiques et évaluations de jeux
- Fournir des outils d'administration efficaces pour la modération du contenu

Le public cible se divise en trois catégories principales :
1. **Joueurs** : Utilisateurs cherchant à découvrir, évaluer et suivre des jeux
2. **Développeurs** : Créateurs de jeux souhaitant soumettre et promouvoir leurs œuvres
3. **Administrateurs** : Modérateurs veillant à la qualité du contenu et à la gestion de la plateforme

### 1.3 Contexte et problématique

Le marché des jeux vidéo connaît une croissance exponentielle, avec une multiplication des titres disponibles et des plateformes de distribution. Dans ce contexte, les joueurs ont besoin d'outils fiables pour identifier les jeux correspondant à leurs préférences, tandis que les développeurs indépendants cherchent des moyens de faire connaître leurs créations.

PlayScore v3 répond à cette problématique en proposant :
- Un système de notation et de critique transparent
- Une mise en avant des jeux indépendants
- Des outils de recherche et de filtrage avancés
- Une interface multilingue pour toucher un public international

### 1.4 Méthodologie de développement

Le projet a été développé selon une méthodologie Agile, avec des cycles de développement itératifs :
- **Planification** : Définition des fonctionnalités et priorisation
- **Conception** : Élaboration des modèles de données et des maquettes d'interface
- **Développement** : Implémentation des fonctionnalités par sprints
- **Tests** : Validation technique et fonctionnelle
- **Déploiement** : Mise en production progressive des fonctionnalités

Cette approche a permis d'adapter le développement aux retours utilisateurs et d'intégrer de nouvelles exigences tout au long du projet.

## 2. Architecture du projet

### 2.1 Vue d'ensemble de l'architecture

PlayScore v3 est construit sur une architecture moderne combinant un backend Laravel avec un frontend React, reliés par Inertia.js. Cette architecture hybride offre les avantages d'une Single Page Application (SPA) tout en conservant la simplicité du routage côté serveur.

L'architecture globale peut être représentée par le diagramme suivant :

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Client (React) │◄────┤  Inertia.js     │◄────┤  Laravel (PHP)  │
│                 │     │                 │     │                 │
└────────┬────────┘     └─────────────────┘     └────────┬────────┘
         │                                               │
         │                                               │
         │                                               │
         │                                      ┌────────▼────────┐
         │                                      │                 │
         └─────────────────────────────────────►│  Base de données│
                                                │  (MySQL)        │
                                                │                 │
                                                └─────────────────┘


```

Cette architecture présente plusieurs avantages :
- **Performance** : Chargement initial complet, puis mises à jour partielles du DOM
- **Expérience utilisateur** : Navigation fluide sans rechargement de page
- **Développement** : Séparation claire des responsabilités
- **SEO** : Rendu côté serveur pour une meilleure indexation

### 2.2 Implémentation du modèle MVC

PlayScore v3 implémente rigoureusement le modèle Modèle-Vue-Contrôleur (MVC), avec quelques adaptations liées à l'utilisation d'Inertia.js :

#### Modèle (M)
Les modèles Laravel définissent la structure des données et les relations entre elles. Exemple du modèle `Jeu` :

```php
// Modèle Jeu : définition des attributs et relations essentiels
class Jeu extends Model
{
    protected $table = 'jeux';
    protected $fillable = ['titre', 'description', 'date_sortie', 'statut'];

    public function developpeur()
    {
        return $this->belongsTo(User::class, 'developpeur_id');
    }
}
```

#### Contrôleur (C)
Les contrôleurs gèrent la logique métier et préparent les données pour les vues. Exemple du contrôleur `JeuController` :

```php
// Contrôleur : récupération des données et rendu de la vue avec Inertia
class JeuController extends Controller
{
    public function show($id)
    {
        $jeu = Jeu::findOrFail($id);
        return Inertia::render('Jeux/Show', [
            'gameDetails' => ['id' => $jeu->id, 'titre' => $jeu->titre],
            'screenshots' => $jeu->screenshots
        ]);
    }
}
```

#### Vue (V)
Avec Inertia.js, les vues sont des composants React qui reçoivent les données du contrôleur. Exemple de vue pour l'affichage d'un jeu :

```jsx
// Vue : composant React recevant les données du contrôleur
export default function Show({ gameDetails, screenshots }) {
    const { t } = useTranslation();
    return (
        <MainLayout>
            <Head title={gameDetails.titre} />
            <div className="game-details-container">
                <h1>{gameDetails.titre}</h1>
            </div>
        </MainLayout>
    );
}
```

### 2.3 Structure des dossiers et organisation du code

L'organisation du code suit une structure claire et modulaire :

#### Backend (Laravel)
```
app/
├── Console/          # Commandes artisan personnalisées
├── Exceptions/       # Gestionnaires d'exceptions
├── Http/
│   ├── Controllers/  # Contrôleurs organisés par domaine
│   │   ├── Admin/    # Contrôleurs pour l'administration
│   │   ├── Developer/# Contrôleurs pour les développeurs
│   │   └── ...
│   ├── Middleware/   # Middleware pour filtrer les requêtes
│   └── Requests/     # Classes de validation de requêtes
├── Models/           # Modèles Eloquent
├── Notifications/    # Classes de notification
├── Observers/        # Observateurs de modèles
├── Providers/        # Fournisseurs de services
└── Services/         # Services métier
```

#### Frontend (React)
```
resources/
├── js/
│   ├── Components/   # Composants React réutilisables
│   │   ├── Admin/    # Composants spécifiques à l'admin
│   │   ├── Developer/# Composants pour les développeurs
│   │   └── ...
│   ├── Layouts/      # Layouts partagés
│   ├── Pages/        # Composants de page (vues Inertia)
│   │   ├── Admin/    # Pages d'administration
│   │   ├── Developer/# Pages pour développeurs
│   │   ├── Jeux/     # Pages liées aux jeux
│   │   └── ...
│   ├── lang/         # Fichiers de traduction
│   └── utils/        # Utilitaires JavaScript
└── css/              # Styles CSS/SCSS
```

Cette organisation facilite la maintenance et l'évolution du code, en séparant clairement les responsabilités et en regroupant les fichiers par domaine fonctionnel.

### 2.4 Programmation orientée objet dans le projet

PlayScore v3 exploite pleinement les principes de la programmation orientée objet (POO) :

#### Encapsulation
Les modèles encapsulent les données et les comportements associés :

```php
// Encapsulation : attributs privés et méthodes publiques
class User extends Authenticatable
{
    // Attributs privés (non accessibles directement)
    protected $fillable = ['name', 'email', 'password', 'role'];
    protected $hidden = ['password', 'remember_token'];

    // Méthode publique pour interagir avec l'objet
    public function isAdmin()
    {
        return $this->role === 'admin' || $this->hasRole('admin');
    }
}
```

#### Héritage
L'héritage est utilisé pour étendre les fonctionnalités des classes de base :

```php
// Héritage : extension de la classe de base Notification
class GameApproved extends Notification implements ShouldQueue
{
    use Queueable;

    // Implémentation spécifique à cette notification
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)->subject('Jeu approuvé');
    }
}
```

#### Polymorphisme
Le polymorphisme est exploité notamment dans le système de notifications :

```php
// Polymorphisme : même méthode, comportements différents
// Dans GameApproved
public function toArray(object $notifiable): array
{
    return ['type' => 'game_approved', 'game_id' => $this->game->id];
}

// Dans GameRejected
public function toArray(object $notifiable): array
{
    return ['type' => 'game_rejected', 'reason' => $this->reason];
}
```

#### Interfaces et traits
Le projet utilise des interfaces et des traits pour partager des comportements :

```php
// Trait : comportement partagé entre plusieurs modèles
trait HasApproval
{
    // Méthode réutilisable dans différentes classes
    public function approve()
    {
        $this->is_approved = true;
        $this->approved_at = now();
        $this->save();
    }
}
```

Cette utilisation approfondie de la POO rend le code plus modulaire, réutilisable et facile à maintenir.
