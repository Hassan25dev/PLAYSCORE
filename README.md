<img width="2453" height="1136" alt="image" src="https://github.com/user-attachments/assets/ace962d5-87f2-4129-8c76-1668926f1604" /># 🎮 PlayScore – Plateforme d’évaluation de jeux vidéo

PlayScore est une application web permettant aux utilisateurs de découvrir, noter et commenter des jeux vidéo, avec un espace dédié aux développeurs et un tableau de bord administrateur pour la modération et l’analyse.

> Projet académique & personnel réalisé avec Laravel, Inertia.js et Tailwind CSS.

---

## 🚀 Fonctionnalités

### 👤 Utilisateurs
- Authentification sécurisée
- Consultation des jeux
- Notation et commentaires
- Wishlist personnalisée
- Export PDF des fiches jeux

### 🎮 Développeurs
- Soumission de jeux
- Suivi des évaluations
- Dashboard dédié

### 🛠 Administrateurs
- Modération des commentaires et avis
- Gestion des utilisateurs
- Validation des jeux
- Statistiques et graphiques

---

## 🧰 Stack Technique

| Technologie | Usage |
|-----------|------|
| Laravel | Backend |
| Inertia.js | SPA Bridge |
| Vue.js / Blade | Frontend |
| Tailwind CSS | UI |
| MySQL | Base de données |
| Vite | Build |
| Chart.js | Graphiques |
| DomPDF | Export PDF |

---

## 📸 Aperçu

<img width="2464" height="1137" alt="image" src="https://github.com/user-attachments/assets/93ee67a9-5e9a-4026-b635-819b1257d81e" />




---

## ⚙️ Installation

```bash
git clone https://github.com/TON-USERNAME/playscore.git
cd playscore
composer install
npm install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
npm run dev
php artisan serve
```
-----

🔐 Configuration

Renseigne ton fichier .env :

``` bash
DB_DATABASE=playscore
DB_USERNAME=root
DB_PASSWORD=
MAIL_MAILER=smtp
```
----

🧪 Tests

``` bash
php artisan test
```
----

📈 Roadmap

 Auth via réseaux sociaux
 Recommandation par IA
 Version mobile
 API publique

---

🤝 Contribution

Les contributions sont bienvenues :
Fork
Branche feature
Pull request

---

📄 Licence

Projet open-source sous licence MIT.
---

💡 Future Improvements

This project can be extended into a more advanced digital gaming analytics and community platform:
Interactive analytics dashboard (ratings, engagement, trends)
Recommendation system based on user behavior
Automated game review moderation using AI
Advanced user segmentation (players / developers / admins)
REST API for mobile application
Performance optimization & caching layer
Deployment with Docker & CI/CD pipeline
These improvements aim to transform PlayScore into a scalable and production-ready platform.

---

🙏 Acknowledgements

This project was developed as a Final Year Project (Projet de Fin d’Études) as part of the Digital Development – Full Stack program at ISTA HH1, under the academic supervision of Youssef El Kabir.

His guidance, technical rigor, and commitment to best development practices played a key role in shaping both the quality of the application and my professional approach to full-stack development.

-----

👤 About

Author: HASSANE AMANAD

Context:
Final year academic and portfolio project developed during my Digital Development (Full Stack) training at ISTA HH1.
The project focuses on designing and implementing a complete web platform with real-world architecture and business logic.

Skills Highlighted:

Full-stack web development (Laravel, Tailwind CSS)
MVC architecture & clean code practices
Database modeling and relational design
Authentication, roles & permissions
Dashboard & admin panel development
RESTful design concepts
Professional technical documentation

License: MIT
GitHub: @Hassan25dev
