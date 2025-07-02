## 7. Validation des données

### 7.1 Validation côté client (React)

La validation côté client est essentielle pour offrir un retour immédiat aux utilisateurs et réduire les requêtes inutiles vers le serveur. PlayScore v3 implémente une validation robuste dans ses formulaires React.

#### Bibliothèques de validation
Pour la validation côté client, nous utilisons principalement :
- **React Hook Form** : Gestion des formulaires
- **Yup** : Schémas de validation

#### Exemple de validation d'un formulaire de soumission de jeu

```jsx
// Schéma de validation Yup pour le formulaire de soumission de jeu
const gameSubmissionSchema = yup.object({
  titre: yup.string()
    .required('game_submission.messages.title_required')
    .min(3, 'game_submission.messages.title_min_length'),
  description: yup.string()
    .required('game_submission.messages.description_required'),
  date_sortie: yup.date()
    .required('game_submission.messages.release_date_required')
});

// Utilisation du schéma avec React Hook Form
const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: yupResolver(gameSubmissionSchema)
});
```

#### Validation en temps réel
La validation en temps réel est implémentée pour offrir un retour immédiat à l'utilisateur :

```jsx
// Validation en temps réel avec affichage conditionnel des erreurs
const { register, formState: { errors, dirtyFields } } = useForm({
  resolver: yupResolver(schema),
  mode: 'onChange' // Active la validation au changement
});

// Affichage des erreurs uniquement pour les champs modifiés
{dirtyFields.email && errors.email && (
  <p className="error-message">{t(errors.email.message)}</p>
)}
```

### 7.2 Validation côté serveur (Laravel)

La validation côté serveur est cruciale pour garantir l'intégrité des données, même si la validation côté client est contournée. Laravel offre un système de validation puissant que nous utilisons pleinement.

#### Classes de requête de validation
Pour chaque type de formulaire, nous avons créé des classes de requête dédiées :

```php
// Classe de requête pour valider les soumissions de jeux
class GameSubmissionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && ($this->user()->isDeveloper() || $this->user()->isAdmin());
    }

    public function rules(): array
    {
        return [
            'titre' => ['required', 'string', 'min:3', 'max:100'],
            'description' => ['required', 'string', 'min:50'],
            'date_sortie' => ['required', 'date', 'before_or_equal:today']
        ];
    }
}
```

#### Utilisation dans les contrôleurs
Les classes de requête sont utilisées dans les contrôleurs pour valider automatiquement les données :

```php
// Contrôleur utilisant la classe de requête pour la validation
class GameSubmissionController extends Controller
{
    public function store(GameSubmissionRequest $request)
    {
        // Les données sont déjà validées grâce à la classe de requête
        $validated = $request->validated();

        // Création et sauvegarde du jeu
        $jeu = new Jeu();
        $jeu->titre = $validated['titre'];
        $jeu->description = $validated['description'];
        $jeu->save();
    }
}
```

#### Validation personnalisée
Des règles de validation personnalisées sont utilisées pour des cas spécifiques :

```php
// Règle de validation personnalisée pour l'unicité des slugs
Validator::extend('unique_slug', function ($attribute, $value, $parameters, $validator) {
    $slug = Str::slug($value);
    $id = $parameters[0] ?? null;

    $query = Jeu::where('slug', $slug);
    if ($id) $query->where('id', '!=', $id);

    return $query->count() === 0;
});
```

### 7.3 Gestion des erreurs et feedback utilisateur

PlayScore v3 implémente un système complet de gestion des erreurs et de feedback utilisateur :

#### Affichage des erreurs de validation côté client
Les erreurs de validation sont affichées de manière claire et contextuelle :

```jsx
// Composant réutilisable pour afficher les erreurs de validation
function FormErrors({ errors, field, t }) {
  if (!errors[field]) return null;

  return (
    <div className="error-container">
      <p className="error-message">{t(errors[field].message)}</p>
      <span className="error-icon">{/* Icône d'erreur */}</span>
    </div>
  );
}
```

#### Gestion des erreurs serveur
Les erreurs serveur sont capturées et affichées à l'utilisateur :

```jsx
// Gestion des erreurs de validation côté serveur
const [serverErrors, setServerErrors] = useState({});

const onSubmit = async (data) => {
  try {
    await axios.post('/api/games', data);
  } catch (error) {
    if (error.response?.status === 422) {
      setServerErrors(error.response.data.errors);
    } else {
      setGlobalError(t('common.server_error'));
    }
  }
};
```

#### Messages flash
Les messages de succès ou d'erreur sont affichés via un système de messages flash :

```jsx
// Composant pour afficher les messages flash (succès, erreur, etc.)
function FlashMessage() {
  const { flash } = usePage().props;
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState('');

  useEffect(() => {
    if (flash.success) {
      setMessage(flash.success);
      setType('success');
      setVisible(true);
    } else if (flash.error) {
      setMessage(flash.error);
      setType('error');
      setVisible(true);
    }

    const timer = setTimeout(() => setVisible(false), 5000);
    return () => clearTimeout(timer);
  }, [flash]);
}
```

### 7.4 Sécurité et prévention des attaques

PlayScore v3 implémente plusieurs mesures de sécurité pour prévenir les attaques courantes :

#### Protection CSRF
Laravel inclut une protection CSRF (Cross-Site Request Forgery) que nous utilisons systématiquement :

```php
// Protection CSRF via middleware dans le groupe web
protected $middlewareGroups = [
    'web' => [
        // Autres middleware...
        \App\Http\Middleware\VerifyCsrfToken::class,
        // Autres middleware...
    ],
];
```

Côté client, le token CSRF est automatiquement inclus dans les requêtes Axios :

```jsx
// Configuration d'Axios pour inclure automatiquement le token CSRF
import axios from 'axios';

axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.withCredentials = true;

// Récupération du token CSRF depuis la balise meta
const token = document.head.querySelector('meta[name="csrf-token"]');
if (token) {
    axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
}
```

#### Protection XSS
Pour prévenir les attaques XSS (Cross-Site Scripting), nous utilisons plusieurs techniques :

1. **Échappement automatique** : React échappe automatiquement les variables dans le JSX
2. **Purification HTML** : Pour le contenu riche, nous utilisons HTML Purifier

```php
// Purification du HTML pour prévenir les attaques XSS
public function store(GameSubmissionRequest $request)
{
    $validated = $request->validated();

    // Configuration et utilisation de HTML Purifier
    $config = HTMLPurifier_Config::createDefault();
    $config->set('HTML.Allowed', 'p,b,i,strong,em,ul,ol,li,br,a[href]');
    $purifier = new HTMLPurifier($config);

    $jeu->description = $purifier->purify($validated['description']);
}
```

#### Validation des permissions
Chaque action est protégée par une vérification des permissions :

```php
// Middleware vérifiant les permissions avant d'autoriser l'accès
public function handle(Request $request, Closure $next, ...$permissions): Response
{
    if (!$request->user()) {
        return redirect()->route('login');
    }

    // Vérification des permissions requises
    foreach ($permissions as $permission) {
        if ($request->user()->hasPermission($permission)) {
            return $next($request);
        }
    }

    return redirect()->route('dashboard')
        ->with('error', 'Permissions insuffisantes');
}
```

#### Rate Limiting
Pour prévenir les attaques par force brute, nous utilisons le rate limiting de Laravel :

```php
// Configuration du rate limiting dans RouteServiceProvider
RateLimiter::for('api', function (Request $request) {
    return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
});

// Rate limiting spécifique pour les tentatives de connexion
RateLimiter::for('login', function (Request $request) {
    return Limit::perMinute(5)->by($request->ip());
});
```

## 8. Fonctionnalités techniques avancées

### 8.1 Génération de fichiers PDF

PlayScore v3 intègre la génération de fichiers PDF pour permettre aux utilisateurs d'exporter les informations des jeux. Cette fonctionnalité utilise la bibliothèque DomPDF via le package Laravel `barryvdh/laravel-dompdf`.

#### Configuration
La bibliothèque DomPDF est configurée dans le fichier `config/dompdf.php` :

```php
return [
    'default_paper_size' => 'a4',
    'default_font' => 'sans-serif',
    'dpi' => 96,
    'font_dir' => storage_path('fonts/'),
    'options' => [
        'isHtml5ParserEnabled' => true,
        'isRemoteEnabled' => true,
    ],
];
```

#### Implémentation
La génération de PDF est implémentée dans le contrôleur `JeuController` :

```php
use Barryvdh\DomPDF\Facade\Pdf;

class JeuController extends Controller
{
    public function generatePDF($id)
    {
        // Récupération du jeu avec ses relations
        $jeu = Jeu::with(['developpeur', 'genres'])
            ->findOrFail($id);

        // Génération du PDF
        $pdf = PDF::loadView('pdf.game-details', [
            'jeu' => $jeu,
            'date' => now()->format('d/m/Y'),
        ]);

        // Téléchargement du PDF
        return $pdf->download("jeu-{$jeu->slug}.pdf");
    }
}
```

#### Template du PDF
Le template Blade pour le PDF est défini dans `resources/views/pdf/game-details.blade.php` :

```blade
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>{{ $jeu->titre }} - Détails</title>
    <style>
        body { font-family: sans-serif; color: #333; }
        .header { text-align: center; margin-bottom: 20px; }
        .game-title { font-size: 24px; font-weight: bold; }
        .section { margin-bottom: 15px; }
    </style>
</head>
<body>
    <div class="header">
        <div class="game-title">{{ $jeu->titre }}</div>
        <div>Généré le {{ $date }}</div>
    </div>

    <div class="section">
        <h2>Description</h2>
        <div>{!! $jeu->description !!}</div>
    </div>
</body>
</html>
```

#### Composant React pour la génération de PDF
Un composant React permet aux utilisateurs de générer des PDF facilement :

```jsx
import React from 'react';
import { useTranslation } from '../../lang/translationHelper';

export default function PdfGenerationComponent({ gameId }) {
  const { t } = useTranslation();

  const handleGeneratePdf = () => {
    window.location.href = `/jeux/${gameId}/pdf`;
  };

  return (
    <div className="pdf-generation">
      <button onClick={handleGeneratePdf} className="pdf-button">
        {t('game_details.generate_pdf')}
      </button>
    </div>
  );
}
