# 🎮 PlayScore – Video Game Rating Platform

PlayScore is a web application that allows users to discover, rate, and review video games, with a dedicated space for developers and an administrator dashboard for moderation and analytics.

> Academic & personal project built with Laravel, Inertia.js, and Tailwind CSS.

---

## 🚀 Features

### 👤 Users
- Secure authentication
- Browse video games
- Ratings and reviews
- Personalized wishlist
- PDF export of game sheets

### 🎮 Developers
- Game submission
- Rating and review tracking
- Dedicated dashboard

### 🛠 Administrators
- Comment and review moderation
- User management
- Game validation
- Statistics and charts

---

## 🧰 Tech Stack

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

Update your .env file:

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


+ Social media authentication

+ AI-based recommendation system

+ Mobile version

+ Public API

---

🤝 Contribution

Contributions are welcome and appreciated!

To contribute:

1- Fork the project

2- Create your feature branch

``` bash
git checkout -b feature/your-feature-name
```

3- Commit your changes

4- Push to your branch

5- Open a Pull Request


---


💡 Future Improvements


+ This project can be extended into a more advanced digital gaming analytics and community platform:

+ Interactive analytics dashboard (ratings, engagement, trends)

+ Recommendation system based on user behavior

+ Automated game review moderation using AI

+ Advanced user segmentation (players / developers / admins)

+ REST API for mobile application

+ Performance optimization & caching layer

+ Deployment with Docker & CI/CD pipeline

+ These improvements aim to transform PlayScore into a scalable and production-ready platform.
  

---

🙏 Acknowledgements

This project was developed as a Final Year Project (Projet de Fin d’Études) as part of the Digital Development – Full Stack program at ISTA HH1, under the academic supervision of Youssef El Kabir.

His guidance, technical rigor, and commitment to best development practices played a key role in shaping both the quality of the application and my professional approach to full-stack development.

-----

👤 About

Author: HASSANE AMANAD

🎓 Context

Final year academic and portfolio project developed during my Digital Development (Full Stack) training at ISTA HH1.
The project focuses on designing and implementing a complete web platform with real-world architecture and business logic.


🧠 Skills Highlighted

✔ Full-stack web development (Laravel, Tailwind CSS)

✔ MVC architecture & clean code practices

✔ Database modeling and relational design

✔ Authentication, roles & permissions

✔ Dashboard & admin panel development

✔ RESTful design concepts

✔ Professional technical documentation

----

License: MIT

GitHub: @Hassan25dev
