## 3. Modélisation de la base de données

### 3.1 Modèle Conceptuel de Données (MCD)

Le Modèle Conceptuel de Données de PlayScore v3 représente les entités principales du système et leurs relations. Ce modèle a été conçu pour répondre aux besoins fonctionnels tout en assurant l'intégrité et la cohérence des données.

```
+----------------+       +----------------+       +----------------+
|  UTILISATEUR   |       |      JEU       |       |    GENRE       |
+----------------+       +----------------+       +----------------+
| id             |       | id             |       | id             |
| nom            |       | slug           |       | nom            |
| email          |       | titre          |       | slug           |
| mot_de_passe   |       | description    |       +----------------+
| role           |       | date_sortie    |              ^
| langue         |       | image          |              |
| est_developpeur|       | note_moyenne   |              |
| email_verifie  |       | metacritic     |              |
+----------------+       | temps_jeu      |     +----------------+
        ^                | developpeur_id |---->|  JEU_GENRE     |
        |                | statut         |     +----------------+
        |                +----------------+     | jeu_id         |
        |                        ^              | genre_id       |
        |                        |              +----------------+
        |                        |
+----------------+     +----------------+       +----------------+
|  EVALUATION    |     |   COMMENTAIRE  |       |  PLATEFORME    |
+----------------+     +----------------+       +----------------+
| utilisateur_id |---->| utilisateur_id |       | id             |
| jeu_id         |---->| jeu_id         |       | nom            |
| note           |     | contenu        |       | slug           |
| commentaire    |     | est_approuve   |       +----------------+
| est_approuve   |     | est_signale    |              ^
| est_signale    |     | raison_signal  |              |
| raison_signal  |     | parent_id      |              |
+----------------+     +----------------+     +----------------+
                                              | JEU_PLATEFORME |
+----------------+                            +----------------+
|   WISHLIST     |                            | jeu_id         |
+----------------+                            | plateforme_id  |
| utilisateur_id |                            | config_min     |
| jeu_id         |                            | config_rec     |
+----------------+                            +----------------+

```

Ce modèle met en évidence les entités principales :
- **UTILISATEUR** : Représente les utilisateurs du système avec leurs différents rôles
- **JEU** : Contient les informations sur les jeux vidéo
- **EVALUATION** : Stocke les notes et commentaires des utilisateurs sur les jeux
- **COMMENTAIRE** : Gère les commentaires indépendants des évaluations
- **GENRE** : Catégorise les jeux par genre
- **PLATEFORME** : Indique les plateformes sur lesquelles les jeux sont disponibles
- **WISHLIST** : Permet aux utilisateurs de marquer les jeux qu'ils souhaitent acquérir
- **LIKE** : Enregistre les jeux appréciés par les utilisateurs

### 3.2 Modèle Physique de Données (MPD)

Le Modèle Physique de Données traduit le MCD en structure de tables relationnelles avec leurs contraintes :

```sql
-- Structure des tables principales avec contraintes
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user', 'developer') DEFAULT 'user'
);

CREATE TABLE jeux (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    developpeur_id BIGINT UNSIGNED NULL,
    FOREIGN KEY (developpeur_id) REFERENCES users(id) ON DELETE SET NULL
);
```

### 3.3 Contraintes et relations

La base de données de PlayScore v3 implémente plusieurs types de contraintes pour garantir l'intégrité des données :

#### Clés primaires
Chaque table possède une clé primaire unique, parfois composite comme dans le cas des évaluations :

```php
// Définition d'une clé primaire composite
Schema::create('evaluations', function (Blueprint $table) {
    $table->unsignedBigInteger('utilisateur_id');
    $table->unsignedBigInteger('jeu_id');
    $table->tinyInteger('note')->unsigned();
    $table->primary(['utilisateur_id', 'jeu_id']); // Clé primaire composite
});
```

#### Clés étrangères
Les relations entre tables sont matérialisées par des clés étrangères avec des règles de cascade appropriées :

```php
// Définition de clés étrangères avec règles de cascade
Schema::create('comments', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->onDelete('cascade');
    $table->foreignId('jeu_id')->constrained('jeux')->onDelete('cascade');
    $table->text('content');
});
```

#### Contraintes de validation
Des contraintes CHECK sont utilisées pour valider les données :

```php
// Contrainte sur la note (entre 1 et 5)
$table->tinyInteger('note')->unsigned()->checkBetween(1, 5);
```

#### Relations Many-to-Many
Les relations plusieurs-à-plusieurs sont implémentées via des tables pivots :

```php
// Relations many-to-many dans le modèle Jeu
public function genres(): BelongsToMany
{
    return $this->belongsToMany(Genre::class, 'jeux_genres');
}

public function plateformes(): BelongsToMany
{
    return $this->belongsToMany(Plateforme::class, 'jeux_plateformes');
}
```

### 3.4 Indexation et optimisation

Pour optimiser les performances des requêtes, plusieurs index ont été créés :

```php
// Création d'index pour optimiser les requêtes fréquentes
Schema::create('comments', function (Blueprint $table) {
    // Index composite pour filtrer les commentaires approuvés par jeu
    $table->index(['jeu_id', 'is_approved']);
});

Schema::create('jeux', function (Blueprint $table) {
    $table->index('titre');
    $table->index('statut');
});
```

Ces index améliorent significativement les performances des requêtes fréquentes, comme la recherche de jeux ou le filtrage des commentaires.

### 3.5 Triggers et procédures stockées

#### Trigger pour la gestion des emails uniques

Un trigger a été implémenté pour gérer la contrainte d'unicité des emails tout en permettant la suppression douce (soft delete) des utilisateurs :

```sql
-- Trigger pour empêcher les emails dupliqués tout en permettant le soft delete
CREATE TRIGGER prevent_duplicate_email_insert
BEFORE INSERT ON users
FOR EACH ROW
BEGIN
    IF EXISTS (SELECT 1 FROM users WHERE email = NEW.email AND deleted_at IS NULL) THEN
        SIGNAL SQLSTATE "45000" SET MESSAGE_TEXT = "Duplicate email not allowed.";
    END IF;
END;
```

Ces triggers permettent de :
1. Empêcher l'insertion d'un nouvel utilisateur avec un email déjà utilisé par un utilisateur actif
2. Empêcher la mise à jour d'un email vers une valeur déjà utilisée par un autre utilisateur actif
3. Autoriser la réutilisation d'emails d'utilisateurs supprimés (soft deleted)

#### Procédure stockée pour le calcul des statistiques de jeu

Une procédure stockée a été créée pour calculer efficacement les statistiques d'un jeu :

```sql
-- Procédure stockée pour calculer les statistiques d'un jeu
CREATE PROCEDURE CalculateGameStats(IN game_id BIGINT)
BEGIN
    DECLARE avg_rating FLOAT;
    DECLARE total_ratings INT;

    -- Calcul de la note moyenne et du nombre d'évaluations
    SELECT AVG(note), COUNT(*) INTO avg_rating, total_ratings
    FROM evaluations
    WHERE jeu_id = game_id AND is_approved = TRUE;

    -- Mise à jour des statistiques du jeu
    UPDATE jeux
    SET rating = COALESCE(avg_rating, 0),
        total_ratings_count = total_ratings
    WHERE id = game_id;
END
```

Cette procédure est appelée après chaque nouvelle évaluation ou commentaire, ainsi que lors des opérations de modération, pour maintenir à jour les statistiques des jeux.

## 4. Diagrammes UML

### 4.1 Diagramme de cas d'utilisation (USE CASE)

Le diagramme de cas d'utilisation illustre les interactions entre les différents acteurs et le système :

```
+---------------------------------------------+
|                 PlayScore v3                |
+---------------------------------------------+
|                                             |
|  +----------+    +---------------------+    |
|  |          |    |                     |    |
|  | Visiteur |----| Consulter les jeux  |    |
|  |          |    |                     |    |
|  +----------+    +---------------------+    |
|       |                                     |
|       |          +---------------------+    |
|       |          |                     |    |
|       +----------| S'inscrire          |    |
|                  |                     |    |
|                  +---------------------+    |
|                                             |
|  +----------+    +---------------------+    |
|  |          |    |                     |    |
|  |          |----| Évaluer un jeu      |    |
|  |          |    |                     |    |
|  |          |    +---------------------+    |
|  |          |                               |
|  |          |    +---------------------+    |
|  |          |    |                     |    |
|  | Joueur   |----| Commenter un jeu    |    |
|  |          |    |                     |    |
|  |          |    +---------------------+    |
|  |          |                               |
|  |          |    +---------------------+    |
|  |          |    |                     |    |
|  |          |----| Gérer sa wishlist   |    |
|  |          |    |                     |    |
|  +----------+    +---------------------+    |
|                                             |
|  +----------+    +---------------------+    |
|  |          |    |                     |    |
|  |          |----| Soumettre un jeu    |    |
|  |          |    |                     |    |
|  |          |    +---------------------+    |
|  |          |                               |
|  |Développeur|    +---------------------+    |
|  |          |    |                     |    |
|  |          |----| Consulter les stats |    |
|  |          |    |                     |    |
|  |          |    +---------------------+    |
|  |          |                               |
|  |          |    +---------------------+    |
|  |          |    |                     |    |
|  |          |----| Modifier ses jeux   |    |
|  |          |    |                     |    |
|  +----------+    +---------------------+    |
|                                             |
|  +----------+    +---------------------+    |
|  |          |    |                     |    |
|  |          |----| Approuver les jeux  |    |
|  |          |    |                     |    |
|  |          |    +---------------------+    |
|  |          |                               |
|  |          |    +---------------------+    |
|  |          |    |                     |    |
|  |  Admin   |----| Modérer commentaires|    |
|  |          |    |                     |    |
|  |          |    +---------------------+    |
|  |          |                               |
|  |          |    +---------------------+    |
|  |          |    |                     |    |
|  |          |----| Gérer utilisateurs  |    |
|  |          |    |                     |    |
|  +----------+    +---------------------+    |
|                                             |
+---------------------------------------------+
```

Ce diagramme montre les quatre types d'acteurs principaux (Visiteur, Joueur, Développeur, Admin) et leurs interactions avec le système. On observe une hiérarchie d'accès, où chaque niveau d'utilisateur hérite des capacités du niveau précédent.

### 4.2 Diagramme de classes

Le diagramme de classes représente la structure statique du système, montrant les classes, leurs attributs, méthodes et relations :

```
+-------------------+       +-------------------+       +-------------------+
|       User        |       |        Jeu        |       |      Genre        |
+-------------------+       +-------------------+       +-------------------+
| -id: bigint       |       | -id: bigint       |       | -id: bigint       |
| -name: string     |       | -slug: string     |       | -nom: string      |
| -email: string    |       | -titre: string    |       | -slug: string     |
| -password: string |       | -description: text|       +-------------------+
| -role: enum       |       | -date_sortie: date|               ^
| -language: string |       | -rating: float    |               |
| -is_developer: bool|<------| -developpeur_id  |               |
+-------------------+       +-------------------+       +-------------------+
| +isAdmin(): bool  |       | +approve()        |       |    JeuGenre       |
| +isDeveloper():bool|      | +reject()         |       +-------------------+
| +hasRole(): bool  |       | +scopeFeatured()  |       | -jeu_id: bigint   |
| +hasPermission()  |       +-------------------+       | -genre_id: bigint |
+-------------------+               ^                   +-------------------+
        ^                           |
        |                           |
+-------------------+       +-------------------+       +-------------------+
|    Evaluation     |       |    Commentaire    |       |    Plateforme     |
+-------------------+       +-------------------+       +-------------------+
| -utilisateur_id   |------>| -user_id: bigint  |       | -id: bigint       |
| -jeu_id: bigint   |------>| -jeu_id: bigint   |       | -nom: string      |
| -note: tinyint    |       | -content: text    |       | -slug: string     |
| -commentaire: text|       | -is_approved: bool|       +-------------------+
| -is_approved: bool|       | -is_flagged: bool |               ^
| -is_flagged: bool |       | -parent_id: bigint|               |
+-------------------+       +-------------------+       +-------------------+
| +approve()        |       | +approve()        |       |  JeuPlateforme    |
| +reject()         |       | +reject()         |       +-------------------+
| +flag()           |       | +flag()           |       | -jeu_id: bigint   |
+-------------------+       +-------------------+       | -plateforme_id    |
                                                        | -config_min: text |
                                                        | -config_rec: text |
                                                        +-------------------+
```

Ce diagramme illustre les principales classes du système et leurs relations :
- Relation 1-n entre User et Jeu (un développeur peut avoir plusieurs jeux)
- Relations n-n entre Jeu et Genre/Plateforme via des tables de jointure
- Relations 1-n entre User/Jeu et Evaluation/Commentaire

### 4.3 Diagrammes de séquence

#### Diagramme de séquence : Soumission et approbation d'un jeu

```
+------------+    +------------+    +------------+    +------------+    +------------+
| Développeur|    |Formulaire  |    |JeuController|    |   Jeu      |    |   Admin    |
+------------+    +------------+    +------------+    +------------+    +------------+
      |                 |                 |                 |                 |
      | Soumet jeu      |                 |                 |                 |
      |---------------->|                 |                 |                 |
      |                 | store()         |                 |                 |
      |                 |---------------->|                 |                 |
      |                 |                 | validate()      |                 |
      |                 |                 |---------------->|                 |
      |                 |                 | create()        |                 |
      |                 |                 |---------------->|                 |
      |                 |                 |                 | save()          |
      |                 |                 |                 |---------------->|
      |                 |                 |                 |                 |
      |                 |                 |                 | notify(admin)   |
      |                 |                 |                 |---------------->|
      |                 |                 |                 |                 |
      |                 |                 |                 |<- review()      |
      |                 |                 |                 |                 |
      |                 |                 |                 |<- approve()     |
      |                 |                 |                 |                 |
      |                 |                 |                 | notify(dev)     |
      |<---------------------------------------------------|                 |
      |                 |                 |                 |                 |
```

Ce diagramme illustre le processus complet de soumission d'un jeu par un développeur, sa validation par le système, et son approbation par un administrateur, avec les notifications associées.

#### Diagramme de séquence : Évaluation et modération d'un commentaire

```
+------------+    +------------+    +------------+    +------------+    +------------+
|  Joueur    |    |Formulaire  |    |RatingContr.|    | Evaluation |    |   Admin    |
+------------+    +------------+    +------------+    +------------+    +------------+
      |                 |                 |                 |                 |
      | Soumet éval.    |                 |                 |                 |
      |---------------->|                 |                 |                 |
      |                 | store()         |                 |                 |
      |                 |---------------->|                 |                 |
      |                 |                 | validate()      |                 |
      |                 |                 |---------------->|                 |
      |                 |                 | create()        |                 |
      |                 |                 |---------------->|                 |
      |                 |                 |                 | save()          |
      |                 |                 |                 |---------------->|
      |                 |                 |                 |                 |
      |                 |                 |                 | notify(admin)   |
      |                 |                 |                 |---------------->|
      |                 |                 |                 |                 |
      |                 |                 |                 |<- review()      |
      |                 |                 |                 |                 |
      |                 |                 |                 |<- approve()     |
      |                 |                 |                 |                 |
      |                 |                 |                 | notify(joueur)  |
      |<---------------------------------------------------|                 |
      |                 |                 |                 |                 |
```

Ce diagramme montre le flux d'une évaluation soumise par un joueur, sa validation par le système, et sa modération par un administrateur, avec les notifications correspondantes.

### 4.4 Diagramme d'état

Le diagramme d'état suivant illustre le cycle de vie d'un jeu dans le système :

```
                    +----------------+
                    |                |
                    |   Brouillon    |<---------+
                    |                |          |
                    +-------+--------+          |
                            |                   |
                            | Soumettre         | Modifier
                            v                   |
                    +----------------+          |
                    |                |          |
                    |  En attente    +----------+
                    |                |
                    +-------+--------+
                            |
                  +---------+---------+
                  |                   |
                  | Examiner          |
                  |                   |
                  v                   v
        +----------------+   +----------------+
        |                |   |                |
        |    Publié      |   |     Rejeté     |
        |                |   |                |
        +----------------+   +----------------+
                |
                | Mettre en avant
                v
        +----------------+
        |                |
        |    À la une    |
        |                |
        +----------------+
```

Ce diagramme montre les différents états possibles d'un jeu dans le système, depuis sa création comme brouillon jusqu'à sa publication ou son rejet, avec la possibilité d'être mis en avant sur la plateforme.
