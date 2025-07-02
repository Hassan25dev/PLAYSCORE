<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>{{ config('app.name', 'Laravel') }} - Simple Welcome</title>
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />
        <style>
            body {
                font-family: 'Figtree', sans-serif;
                background-color: #f3f4f6;
                color: #1f2937;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 1200px;
                margin: 0 auto;
                padding: 2rem;
            }
            header {
                background-color: white;
                padding: 1rem 0;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            }
            .header-content {
                display: flex;
                justify-content: space-between;
                align-items: center;
                max-width: 1200px;
                margin: 0 auto;
                padding: 0 2rem;
            }
            .logo {
                font-size: 1.5rem;
                font-weight: 600;
                color: #2563eb;
            }
            .nav-links a {
                margin-left: 1.5rem;
                color: #4b5563;
                text-decoration: none;
                transition: color 0.2s;
            }
            .nav-links a:hover {
                color: #2563eb;
            }
            .hero {
                background-color: #2563eb;
                color: white;
                padding: 4rem 0;
                text-align: center;
            }
            .hero h1 {
                font-size: 2.5rem;
                margin-bottom: 1rem;
            }
            .hero p {
                font-size: 1.25rem;
                max-width: 800px;
                margin: 0 auto;
            }
            .section-title {
                font-size: 1.5rem;
                margin-bottom: 1.5rem;
                padding-bottom: 0.5rem;
                border-bottom: 2px solid #e5e7eb;
            }
            .game-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                gap: 1.5rem;
                margin-bottom: 3rem;
            }
            .game-card {
                background-color: white;
                border-radius: 0.5rem;
                overflow: hidden;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                transition: transform 0.2s, box-shadow 0.2s;
            }
            .game-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
            }
            .game-image {
                width: 100%;
                height: 150px;
                object-fit: cover;
            }
            .game-info {
                padding: 1rem;
            }
            .game-title {
                font-weight: 600;
                margin-bottom: 0.5rem;
            }
            .game-meta {
                display: flex;
                justify-content: space-between;
                color: #6b7280;
                font-size: 0.875rem;
            }
            .game-rating {
                display: flex;
                align-items: center;
            }
            .star {
                color: #f59e0b;
                margin-right: 0.25rem;
            }
            .auth-buttons {
                margin-top: 2rem;
                display: flex;
                justify-content: center;
                gap: 1rem;
            }
            .btn {
                display: inline-block;
                padding: 0.5rem 1rem;
                border-radius: 0.375rem;
                text-decoration: none;
                font-weight: 500;
                transition: background-color 0.2s;
            }
            .btn-primary {
                background-color: #2563eb;
                color: white;
            }
            .btn-primary:hover {
                background-color: #1d4ed8;
            }
            .btn-outline {
                border: 1px solid #2563eb;
                color: #2563eb;
            }
            .btn-outline:hover {
                background-color: #eff6ff;
            }
            footer {
                background-color: #1f2937;
                color: #9ca3af;
                padding: 2rem 0;
                margin-top: 3rem;
            }
            .footer-content {
                max-width: 1200px;
                margin: 0 auto;
                padding: 0 2rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .footer-links a {
                color: #9ca3af;
                margin-left: 1rem;
                text-decoration: none;
            }
            .footer-links a:hover {
                color: white;
            }
        </style>
    </head>
    <body>
        <header>
            <div class="header-content">
                <div class="logo">{{ config('app.name', 'Laravel') }}</div>
                <div class="nav-links">
                    @if (Route::has('login'))
                        @auth
                            <a href="{{ url('/dashboard') }}">Dashboard</a>
                        @else
                            <a href="{{ route('login') }}">Log in</a>
                            @if (Route::has('register'))
                                <a href="{{ route('register') }}">Register</a>
                            @endif
                        @endauth
                    @endif
                </div>
            </div>
        </header>

        <section class="hero">
            <div class="container">
                <h1>Welcome to {{ config('app.name', 'Laravel') }}</h1>
                <p>Your ultimate platform for discovering, rating, and discussing video games.</p>
                
                @if (Route::has('login'))
                    @guest
                        <div class="auth-buttons">
                            <a href="{{ route('login') }}" class="btn btn-primary">Log in</a>
                            @if (Route::has('register'))
                                <a href="{{ route('register') }}" class="btn btn-outline">Register</a>
                            @endif
                        </div>
                    @endguest
                @endif
            </div>
        </section>

        <div class="container">
            <section>
                <h2 class="section-title">Recent Releases</h2>
                <div class="game-grid">
                    @foreach($recentReleases as $game)
                    <div class="game-card">
                        <img src="{{ $game['background_image'] ?? 'https://placehold.co/600x400?text=No+Image' }}" alt="{{ $game['name'] }}" class="game-image">
                        <div class="game-info">
                            <div class="game-title">{{ $game['name'] }}</div>
                            <div class="game-meta">
                                <div>{{ $game['released'] ?? 'Unknown date' }}</div>
                                <div class="game-rating">
                                    <span class="star">★</span>
                                    {{ number_format($game['rating'] ?? 0, 1) }}
                                </div>
                            </div>
                        </div>
                    </div>
                    @endforeach
                </div>
            </section>

            <section>
                <h2 class="section-title">Top Rated Games</h2>
                <div class="game-grid">
                    @foreach($topGames as $game)
                    <div class="game-card">
                        <img src="{{ $game['background_image'] ?? 'https://placehold.co/600x400?text=No+Image' }}" alt="{{ $game['name'] }}" class="game-image">
                        <div class="game-info">
                            <div class="game-title">{{ $game['name'] }}</div>
                            <div class="game-meta">
                                <div>{{ $game['released'] ?? 'Unknown date' }}</div>
                                <div class="game-rating">
                                    <span class="star">★</span>
                                    {{ number_format($game['rating'] ?? 0, 1) }}
                                </div>
                            </div>
                        </div>
                    </div>
                    @endforeach
                </div>
            </section>
        </div>

        <footer>
            <div class="footer-content">
                <div>
                    &copy; {{ date('Y') }} {{ config('app.name', 'Laravel') }}. All rights reserved.
                </div>
                <div class="footer-links">
                    <a href="#">About</a>
                    <a href="#">Privacy</a>
                    <a href="#">Terms</a>
                    <a href="#">Contact</a>
                </div>
            </div>
        </footer>
    </body>
</html>