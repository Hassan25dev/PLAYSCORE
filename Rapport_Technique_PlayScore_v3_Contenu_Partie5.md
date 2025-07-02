### 8.2 Système d'envoi d'emails

PlayScore v3 intègre un système d'envoi d'emails pour diverses fonctionnalités : vérification d'email, notifications, récupération de mot de passe, etc. Ce système utilise les fonctionnalités de messagerie de Laravel.

#### Configuration du système d'email

La configuration du système d'email est définie dans le fichier `.env` et `config/mail.php` :

```php
// Extrait de config/mail.php
'mailers' => [
    'smtp' => [
        'transport' => 'smtp',
        'host' => env('MAIL_HOST', 'smtp.mailgun.org'),
        'port' => env('MAIL_PORT', 587),
    ],
],
```

#### Notification de vérification d'email personnalisée

Pour personnaliser les emails de vérification, nous avons créé une classe dédiée :

```php
// Extrait de CustomVerifyEmail.php
public function toMail($notifiable)
{
    return (new MailMessage)
        ->subject(__('Vérifiez votre adresse e-mail'))
        ->action(__('Vérifier l\'adresse e-mail'), $this->verificationUrl($notifiable));
}
```

#### Notification pour les nouvelles soumissions de jeux

Lorsqu'un développeur soumet un jeu, les administrateurs reçoivent une notification par email :

```php
// Extrait de NewGameSubmission.php
public function via(object $notifiable): array
{
    return ['mail', 'database'];
}

public function toMail(object $notifiable): MailMessage
{
    return (new MailMessage)
        ->subject(__('notifications.email.subject.new_game_submission'))
        ->line(__('notifications.messages.new_game_submission', [
            'game' => $this->game->titre
        ]));
}
```

#### File d'attente pour l'envoi d'emails

Pour améliorer les performances, les emails sont envoyés via une file d'attente :

```php
// Implémentation de ShouldQueue dans les notifications
class NewGameSubmission extends Notification implements ShouldQueue
{
    use Queueable;
    // ...
}
```

Le traitement des files d'attente est géré par un worker dédié, configuré dans un script batch :

```batch
@echo off
REM queue-worker.bat
php artisan queue:work --tries=3 --timeout=60
```

### 8.3 Consommation de l'API RAWG

PlayScore v3 intègre l'API RAWG pour enrichir sa base de données de jeux. Cette intégration permet d'importer des informations détaillées sur les jeux, les plateformes, les genres, etc.

#### Configuration de l'API

La clé d'API est stockée dans le fichier `.env` et accessible via le système de configuration :

```php
// Accès à la clé d'API
$apiKey = config('services.rawg.key');
```

#### Contrôleur d'API RAWG

Un contrôleur dédié gère les interactions avec l'API RAWG :

```php
// Extrait de RawgController.php
public function search(Request $request)
{
    $query = $request->input('query');
    $response = Http::get('https://api.rawg.io/api/games', [
        'key' => config('services.rawg.key'),
        'search' => $query
    ]);

    return response()->json($response->json());
}
```

#### Service d'importation de jeux

Un service dédié gère l'importation des données de jeux depuis l'API RAWG :

```php
// Extrait de RawgImportService.php
public function importGame($rawgId)
{
    $response = Http::get("https://api.rawg.io/api/games/{$rawgId}", [
        'key' => $this->apiKey
    ]);

    if ($response->successful()) {
        $gameData = $response->json();
        return $this->createOrUpdateGame($gameData);
    }

    return null;
}
```

#### Composant de recherche RAWG

Un composant React permet aux développeurs de rechercher des jeux dans l'API RAWG :

```jsx
// Extrait du composant RawgSearch
const searchGames = async (query) => {
  setLoading(true);
  try {
    const response = await axios.get('/api/rawg/search', {
      params: { query }
    });
    setResults(response.data.results);
  } finally {
    setLoading(false);
  }
};
```

### 8.4 Exportation/importation XML

PlayScore v3 permet l'exportation et l'importation de données au format XML, notamment pour les jeux et les données utilisateur.

#### Contrôleur XML

Un contrôleur dédié gère les opérations XML :

```php
// Extrait de XmlController.php
public function exportGame($id)
{
    $jeu = Jeu::with(['genres', 'developpeur'])->findOrFail($id);

    $xml = new \SimpleXMLElement('<?xml version="1.0" encoding="UTF-8"?><jeu></jeu>');

    // Ajout des attributs de base
    $xml->addChild('id', $jeu->id);
    $xml->addChild('titre', $jeu->titre);

    return response($xml->asXML(), 200)
        ->header('Content-Type', 'application/xml');
}
```

#### Importation XML

L'importation XML utilise la bibliothèque SimpleXML de PHP :

```php
// Extrait de la méthode d'importation XML
public function importXml(Request $request)
{
    $file = $request->file('xml_file');

    if (!$file) {
        return response()->json(['error' => 'No file uploaded'], 400);
    }

    try {
        $xml = simplexml_load_string($file->get());
        // Traitement des données XML
    } catch (\Exception $e) {
        return response()->json(['error' => 'Invalid XML file']);
    }
}
```

#### Composant d'exportation/importation XML

Un composant React permet aux utilisateurs d'exporter et d'importer des données XML :

```jsx
// Extrait du composant XmlImportExportComponent
const handleExport = () => {
  window.location.href = `/api/user/export-xml`;
};

const handleImport = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('xml_file', file);

  try {
    await axios.post('/api/user/import-xml', formData);
    setMessage('Import réussi');
  } catch (error) {
    setError('Erreur lors de l\'import');
  }
};
```

### 8.5 Transactions dans la base de données

PlayScore v3 utilise des transactions pour garantir l'intégrité des données lors d'opérations complexes impliquant plusieurs tables.

#### Soumission de jeu avec transactions

Lors de la soumission d'un jeu, plusieurs tables sont mises à jour dans une transaction :

```php
// Extrait de GameSubmissionController.php
public function submit(Request $request, $id)
{
    DB::beginTransaction();

    try {
        // Récupération du jeu
        $jeu = Jeu::findOrFail($id);

        // Mise à jour du statut
        $jeu->statut = 'en_attente';
        $jeu->submitted_at = now();
        $jeu->save();

        DB::commit();
        return redirect()->route('developer.dashboard');
    } catch (\Exception $e) {
        DB::rollBack();
        return back()->with('error', 'Une erreur est survenue');
    }
}
```

#### Approbation de jeu avec transactions

L'approbation d'un jeu implique également plusieurs opérations dans une transaction :

```php
// Extrait de GameApprovalController.php
public function approve(Request $request, $id)
{
    DB::beginTransaction();

    try {
        $jeu = Jeu::findOrFail($id);
        $jeu->statut = 'publie';
        $jeu->approved_at = now();
        $jeu->save();

        DB::commit();
        return redirect()->route('admin.game-approvals.index');
    } catch (\Exception $e) {
        DB::rollBack();
        return back()->with('error', 'Une erreur est survenue');
    }
}
```

### 8.6 Visualisation de données avec des graphiques

PlayScore v3 intègre des visualisations de données sous forme de graphiques pour présenter des statistiques aux utilisateurs, développeurs et administrateurs.

#### Configuration de Chart.js

Les graphiques sont créés avec Chart.js, configuré dans le projet :

```jsx
// Extrait de la configuration Chart.js
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

// Configuration globale
Chart.defaults.font.family = "'Poppins', 'Helvetica', 'Arial', sans-serif";
Chart.defaults.color = '#6b7280';
```

#### Composant de distribution des notes

Un composant affiche la distribution des notes pour un jeu :

```jsx
// Extrait de RatingsDistributionChart.jsx
const data = {
  labels: [1, 2, 3, 4, 5],
  datasets: [{
    label: t('charts.ratings'),
    data: [
      ratings.filter(r => r.rating === 1).length,
      ratings.filter(r => r.rating === 2).length,
      ratings.filter(r => r.rating === 3).length,
      ratings.filter(r => r.rating === 4).length,
      ratings.filter(r => r.rating === 5).length
    ]
  }]
};
```

#### Graphique d'activité utilisateur

Un graphique montre l'activité d'un utilisateur au fil du temps :

```jsx
// Extrait de UserActivityChart.jsx
const prepareData = () => {
  // Regroupement des activités par mois
  const monthlyData = {};

  activities.forEach(activity => {
    const date = new Date(activity.created_at);
    const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;

    if (!monthlyData[monthYear]) {
      monthlyData[monthYear] = 0;
    }

    monthlyData[monthYear]++;
  });

  return {
    labels: Object.keys(monthlyData),
    datasets: [{
      label: t('charts.activity'),
      data: Object.values(monthlyData)
    }]
  };
};
```

#### Graphique de progression des approbations

Un graphique dans le dashboard administrateur montre la progression des approbations de jeux :

```jsx
// Extrait de WorkflowProgress.jsx
const data = {
  labels: [
    t('admin.dashboard.pending_games'),
    t('admin.dashboard.approved_games')
  ],
  datasets: [{
    data: [stats.pending_games, stats.approved_games]
  }]
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'right',
    }
  }
};
```

## 9. Interfaces utilisateur

### 9.1 Dashboard administrateur

Le dashboard administrateur est l'interface centrale pour la gestion de la plateforme. Il offre une vue d'ensemble des statistiques, des activités récentes et des actions rapides.

#### Structure du dashboard

Le dashboard administrateur est organisé en plusieurs sections :

1. **Vue d'ensemble** : Statistiques globales (utilisateurs, jeux, commentaires, évaluations)
2. **Activité récente** : Flux d'activités sur la plateforme
3. **Progression du workflow** : Graphique montrant l'état des soumissions de jeux
4. **Actions rapides** : Accès direct aux fonctionnalités principales

#### Composant principal du dashboard

```jsx
// Extrait simplifié du composant Dashboard.jsx
export default function Dashboard({ auth, stats, recentActivity }) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <MainLayout auth={auth}>
      <Head title={t('admin.dashboard.title')} />
      <div className="admin-dashboard">
        <h1>{t('admin.dashboard.title')}</h1>

        <div className="dashboard-tabs">
          <button className={activeTab === 'overview' ? 'active' : ''}
                  onClick={() => setActiveTab('overview')}>
            {t('admin.dashboard.overview_tab')}
          </button>
        </div>
      </div>
    </MainLayout>
  );
}
```

#### Flux d'activité amélioré

Le flux d'activité permet aux administrateurs de suivre les événements récents sur la plateforme :

```jsx
// Extrait du composant EnhancedActivityFeed
const renderActivityItem = (item) => {
  const icon = getActivityIcon(item.type);

  return (
    <div className="activity-item" key={item.id}>
      <div className="activity-icon">{icon}</div>
      <div className="activity-content">
        <div className="activity-title">{item.title}</div>
      </div>
    </div>
  );
};
```

### 9.2 Dashboard développeur

Le dashboard développeur est conçu pour permettre aux créateurs de jeux de gérer leurs soumissions et de suivre leurs performances.

#### Structure du dashboard développeur

Le dashboard développeur comprend :

1. **Statistiques** : Nombre de jeux, soumissions en attente, jeux publiés, etc.
2. **Actions rapides** : Création de jeu, gestion des brouillons, etc.
3. **Activité récente** : Commentaires, évaluations et autres interactions sur les jeux du développeur

#### Composant de statistiques développeur

```jsx
// Extrait du composant DeveloperStats
function DeveloperStats({ stats }) {
  const { t } = useTranslation();

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-value">{stats.total}</div>
        <div className="stat-label">{t('developer.dashboard.total_games')}</div>
      </div>
      <div className="stat-card">
        <div className="stat-value">{stats.published}</div>
        <div className="stat-label">{t('developer.dashboard.published')}</div>
      </div>
    </div>
  );
}
```

### 9.3 Interface utilisateur standard

L'interface utilisateur standard est conçue pour les joueurs qui consultent, évaluent et commentent les jeux.

#### Page d'accueil

La page d'accueil présente les jeux populaires, les sorties récentes et les jeux indépendants :

```jsx
// Extrait du composant Welcome
export default function Welcome({ auth, featuredGames }) {
  const { t } = useTranslation();

  return (
    <MainLayout auth={auth}>
      <Head title={t('welcome.hero_title')} />

      <section className="hero-section">
        <h1>{t('welcome.hero_title')}</h1>
        <p>{t('welcome.hero_subtitle')}</p>
        <div className="hero-buttons">
          <Link href="/jeux" className="primary-button">
            {t('welcome.browse_games')}
          </Link>
        </div>
      </section>
    </MainLayout>
  );
}
```

#### Composant de carte de jeu

Le composant GameCard affiche les informations essentielles d'un jeu :

```jsx
// Extrait du composant GameCard
const GameCard = ({ game }) => {
  const { t } = useTranslation();
  const hasVideo = game.video_path || game.video_url;

  return (
    <div className="game-card">
      <div className="game-card-media">
        {hasVideo ? (
          <video src={game.video_path} controls></video>
        ) : (
          <img src={game.image_arriere_plan} alt={game.titre} />
        )}
      </div>
      <div className="game-card-content">
        <h3 className="game-card-title">{game.titre}</h3>
      </div>
    </div>
  );
};
```

### 9.4 Composants réutilisables

PlayScore v3 utilise de nombreux composants réutilisables pour maintenir la cohérence de l'interface et faciliter la maintenance.

#### Composant de pagination

```jsx
// Extrait du composant Pagination
export default function Pagination({ links }) {
  return (
    <div className="pagination">
      {links.map((link, i) => (
        <Link
          key={i}
          href={link.url || '#'}
          className={`pagination-link ${link.active ? 'active' : ''}`}
        />
      ))}
    </div>
  );
}
```

#### Composant de message flash

```jsx
// Extrait du composant FlashMessageV2
export default function FlashMessageV2() {
  const { flash } = usePage().props;
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState('');

  useEffect(() => {
    if (flash.success || flash.error) {
      setVisible(true);
      setTimeout(() => setVisible(false), 5000);
    }
  }, [flash]);

  if (!visible) return null;

  return (
    <div className={`flash-message flash-${type}`}>
      <p>{message}</p>
    </div>
  );
}
```

### 9.5 Responsive design

PlayScore v3 est entièrement responsive, s'adaptant aux différentes tailles d'écran (mobile, tablette, desktop).

#### Approche mobile-first

Le CSS utilise une approche mobile-first avec des media queries pour les écrans plus grands :

```css
/* Extrait de styles CSS pour le responsive design */
.game-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 640px) {
  .game-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .game-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

#### Menu responsive

Le menu de navigation s'adapte aux différentes tailles d'écran :

```jsx
// Extrait du composant Header pour le menu responsive
const [sidebarOpen, setSidebarOpen] = useState(false);

const toggleSidebar = () => {
  setSidebarOpen(!sidebarOpen);
};

return (
  <header className={`header ${scrolled ? 'scrolled' : ''}`}>
    <div className="logo-container">
      <button className="menu-icon" onClick={toggleSidebar}>
        {/* Icône de menu */}
      </button>
    </div>

    <nav className={`main-nav ${sidebarOpen ? 'open' : ''}`}>
      {/* Liens de navigation */}
    </nav>
  </header>
);
```
