import { Link, Head } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import GameCard from '../components/GameCard/GameCard';
import React, { useState, useEffect, useRef } from 'react';
import { Provider } from 'react-redux';
import { store } from '../store';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import { t, setLocale, getLocale } from '../lang/translationHelper';
import welcomeImage1 from '../images/Welcom image 1.jpg';
import welcomeImage2 from '../images/welcom image 2.jpg';
import welcomeImage3 from '../images/welcom image 3.jpg';
import welcomeImage4 from '../images/welcom image 4.jpg';
import welcomeImage5 from '../images/welcom image 5.jpg';
import welcomeImage6 from '../images/welcom image 6.jpg';
import Cyberpunk2077 from '../images/Cyberpunk 2077.jpg';
import logo from '../images/logo.jpg';
import './Welcome.css';

/**
 * Welcome page component
 * @param {Object} props - Component props
 * @param {Object} props.auth - Authentication information including user and locale
 * @param {string} props.laravelVersion - Laravel version
 * @param {string} props.phpVersion - PHP version
 * @param {Array} props.recentReleases - List of recent game releases
 * @param {Array} props.topGames - List of top-rated games
 * @param {boolean} props.canLogin - Whether login is available
 * @param {boolean} props.canRegister - Whether registration is available
 * @returns {JSX.Element} Welcome page component
 */
export default function Welcome({ auth, laravelVersion, phpVersion, recentReleases, topGames, indieGames, canLogin, canRegister }) {
  // Use the current locale from the translation helper
  const [locale, setLocaleState] = useState(getLocale());
  const [activeSlide, setActiveSlide] = useState(0);
  const sliderRef = useRef(null);
  const totalSlides = 5; // We'll use 5 of the 7 images for the hero slider

  // Listen for locale changes
  useEffect(() => {
    const handleLocaleChange = (e) => {
      console.log('Welcome component detected locale change:', e.detail.locale);
      setLocaleState(e.detail.locale);
    };

    // Add event listener
    document.addEventListener('localeChanged', handleLocaleChange);

    // Cleanup
    return () => {
      document.removeEventListener('localeChanged', handleLocaleChange);
    };
  }, []);

  // Auto-rotate hero slider
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Hero slider content
  const heroSlides = [
    {
      image: welcomeImage1,
      title: t('welcome.hero_title'),
      subtitle: t('welcome.hero_subtitle'),
      primaryLink: '/jeux',
      primaryText: t('welcome.browse_games')
    },
    {
      image: welcomeImage2,
      title: t('welcome.discover_title'),
      subtitle: t('welcome.discover_subtitle'),
      primaryLink: '/categories',
      primaryText: t('welcome.explore_categories')
    },
    {
      image: welcomeImage3,
      title: t('welcome.top_games'),
      subtitle: t('welcome.feature_community_voting_desc'),
      primaryLink: '/jeux?sort=rating',
      primaryText: t('welcome.view_all')
    },
    {
      image: welcomeImage4,
      title: t('welcome.community_highlights'),
      subtitle: t('welcome.community_highlights_desc'),
      primaryLink: '/community',
      primaryText: t('welcome.join_discussions')
    },
    {
      image: welcomeImage5,
      title: t('welcome.recent_releases'),
      subtitle: t('welcome.feature_discovery_tools_desc'),
      primaryLink: '/jeux?sort=recent',
      primaryText: t('welcome.browse_games')
    }
  ];

  // Stats for the community section
  const communityStats = [
    { number: '10K+', label: t('welcome.stat_users') },
    { number: '50K+', label: t('welcome.stat_reviews') },
    { number: '5K+', label: t('welcome.stat_games') },
    { number: '100K+', label: t('welcome.stat_ratings') }
  ];

  // Features for the how it works section
  const features = [
    {
      icon: '🎮',
      title: t('welcome.feature_user_reviews'),
      description: t('welcome.feature_user_reviews_desc')
    },
    {
      icon: '🏆',
      title: t('welcome.feature_expert_reviews'),
      description: t('welcome.feature_expert_reviews_desc')
    },
    {
      icon: '👥',
      title: t('welcome.feature_community_voting'),
      description: t('welcome.feature_community_voting_desc')
    },
    {
      icon: '🔍',
      title: t('welcome.feature_discovery_tools'),
      description: t('welcome.feature_discovery_tools_desc')
    }
  ];

  return (
    <Provider store={store}>
      <>
        <Head title={t('welcome.hero_title')} />
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
          <div className="sticky top-0 z-50">
            <Header auth={auth} canLogin={canLogin} canRegister={canRegister} currentUrl="/" />
          </div>

          {/* Hero Section with Image Slider */}
          <header className="hero-section relative overflow-hidden">
            <div className="hero-slider" ref={sliderRef}>
              {heroSlides.map((slide, index) => (
                <div
                  key={index}
                  className={`hero-slide ${activeSlide === index ? 'active' : ''}`}
                  style={{ backgroundImage: `url(${slide.image})` }}
                >
                  <div className="hero-content">
                    <h1 className="hero-title">{slide.title}</h1>
                    <p className="hero-subtitle">{slide.subtitle}</p>
                    <div className="hero-buttons">
                      <Link href={slide.primaryLink} className="btn btn-primary">
                        {slide.primaryText}
                      </Link>
                      {!auth?.user && canRegister && (
                        <Link href={route('register')} className="btn btn-secondary">
                          {t('welcome.join_community')}
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Slider Navigation */}
            <div className="slider-nav">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  className={`slider-dot ${activeSlide === index ? 'active' : ''}`}
                  onClick={() => setActiveSlide(index)}
                  aria-label={`Slide ${index + 1}`}
                ></button>
              ))}
            </div>
          </header>

          {/* Community Stats Section */}
          <section className="stats-section">
            <div className="container">
              <div className="stats-grid">
                {communityStats.map((stat, index) => (
                  <div className="stat-card" key={index}>
                    <div className="stat-number">{stat.number}</div>
                    <div className="stat-label">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Recent Releases Section */}
          <section className="games-section recent-releases">
            <div className="container">
              <div className="section-header">
                <h2 className="section-title">{t('welcome.recent_releases')}</h2>
                <Link href="/jeux?sort=recent" className="view-all-link">
                  
                </Link>
              </div>
              {recentReleases && recentReleases.length > 0 ? (
                <div className="games-grid">
                  {/* Force sort by release date, newest first */}
                  {[...recentReleases]
                    .sort((a, b) => {
                      // Parse dates
                      const dateA = a.released ? new Date(a.released) : new Date(0);
                      const dateB = b.released ? new Date(b.released) : new Date(0);
                      // Sort descending (newest first)
                      return dateB - dateA;
                    })
                    .map((game) => {
                      // RAWG IDs are typically large numbers (>1000)
                      // No need to modify the ID, just use it directly
                      const gameId = game.id;

                      return (
                        <div key={game.id} onClick={() => Inertia.visit(`/jeux/${gameId}`)}>
                          <GameCard key={game.id} game={game} />
                        </div>
                      );
                    })
                  }
                </div>
              ) : (
                <p className="no-games-message">{t('welcome.no_recent_releases')}</p>
              )}
            </div>
          </section>

          {/* Top Games Section */}
          <section className="games-section top-games">
            <div className="container">
              <div className="section-header">
                <h2 className="section-title">{t('welcome.top_games')}</h2>
                <Link href="/jeux?sort=rating" className="view-all-link">
                  
                </Link>
              </div>
              {topGames && topGames.length > 0 ? (
                <div className="games-grid">
                  {/* Force sort by rating, highest first */}
                  {[...topGames]
                    .sort((a, b) => {
                      // Sort by rating descending (highest first)
                      const ratingA = a.rating || 0;
                      const ratingB = b.rating || 0;
                      return ratingB - ratingA;
                    })
                    .map((game) => {
                      // RAWG IDs are typically large numbers (>1000)
                      // No need to modify the ID, just use it directly
                      const gameId = game.id;

                      return (
                        <div key={game.id} onClick={() => Inertia.visit(`/jeux/${gameId}`)}>
                          <GameCard key={game.id} game={game} />
                        </div>
                      );
                    })
                  }
                </div>
              ) : (
                <p className="no-games-message">{t('welcome.no_top_games')}</p>
              )}
              {!auth?.user && canRegister && (
                <div className="signup-prompt">
                  <Link href={route('register')} className="signup-link">
                    {t('welcome.signup_prompt')}
                  </Link>
                </div>
              )}
            </div>
          </section>

          {/* Indie Games Section */}
          <section className="games-section indie-games">
            <div className="container">
              <div className="section-header">
                <h2 className="section-title">{t('welcome.indie_games') || 'Indie Games Spotlight'}</h2>
                <Link href={route('jeux.indie')} className="view-all-link">
                 
                </Link>
              </div>
              <p className="indie-description">
                {t('welcome.indie_games_desc') || 'Discover amazing games from independent developers. Support creativity and innovation in game development.'}
              </p>
              {indieGames && indieGames.length > 0 ? (
                <div className="games-grid">
                  {indieGames.map((game) => {
                    // Database IDs are typically small numbers (<1000)
                    // No need to modify the ID, just use it directly
                    const gameId = game.id;

                    return (
                      <div key={game.id} className="indie-game-card-wrapper">
                        <div onClick={() => Inertia.visit(`/jeux/${gameId}`)}>
                          <GameCard game={game} />
                        </div>
                        {game.developer && (
                          <div className="indie-developer-badge">
                            {t('welcome.by_developer', { developer: game.developer }) || `By ${game.developer}`}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="no-games-message">
                  <p>{t('welcome.no_indie_games') || 'No indie games available at the moment. Check back soon!'}</p>
                  {auth?.user?.role === 'developer' ? (
                    <Link href={route('game-submissions.create')} className="btn btn-primary mt-4">
                      {t('welcome.submit_your_game') || 'Submit Your Game'}
                    </Link>
                  ) : (
                    <p className="mt-4">
                      {t('welcome.are_you_developer') || 'Are you a game developer? '}
                      <Link href={route('register')} className="text-indigo-500 hover:text-indigo-600">
                        {t('welcome.register_as_developer') || 'Register as a developer'}
                      </Link>
                      {t('welcome.and_submit_your_game') || ' and submit your game!'}
                    </p>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* Game Categories Section */}
          <section className="categories-section">
            <div className="container">
              <div className="section-header">
                <h2 className="section-title">{t('welcome.explore_categories')}</h2>
                <Link href="/categories" className="view-all-link">
                
                </Link>
              </div>

              <div className="categories-grid">
                <div className="category-card" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(${welcomeImage3})` }}>
                  <h3 className="category-title">Action</h3>
                  <Link href="/categories/action" className="category-link">
                    {t('welcome.browse_games')}
                  </Link>
                </div>
                <div className="category-card" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(${welcomeImage4})` }}>
                  <h3 className="category-title">Adventure</h3>
                  <Link href="/categories/adventure" className="category-link">
                    {t('welcome.browse_games')}
                  </Link>
                </div>
                <div className="category-card" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(${welcomeImage5})` }}>
                  <h3 className="category-title">RPG</h3>
                  <Link href="/categories/rpg" className="category-link">
                    {t('welcome.browse_games')}
                  </Link>
                </div>
                <div className="category-card" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(${Cyberpunk2077})` }}>
                  <h3 className="category-title">Strategy</h3>
                  <Link href="/categories/strategy" className="category-link">
                    {t('welcome.browse_games')}
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Featured Game Section */}
          <section className="featured-game-section">
            <div className="container">
              <div className="featured-game" style={{ cursor: 'pointer' }}>
                <div className="featured-game-image" style={{ backgroundImage: `url(${Cyberpunk2077})` }}>
                  <div className="featured-game-overlay">
                    <div className="featured-badge">Featured Game</div>
                  </div>
                </div>
                <div className="featured-game-content">
                  <h2 className="featured-game-title">Cyberpunk 2077</h2>
                  <div className="featured-game-meta">
                    <span className="featured-game-rating">4.7/5</span>
                    <span className="featured-game-genre">RPG, Action, Open World</span>
                    <span className="featured-game-platform">PC, PS5, Xbox Series X</span>
                  </div>
                  <p className="featured-game-description">
                    Cyberpunk 2077 is an open-world, action-adventure RPG set in the megalopolis of Night City, where you play as a cyberpunk mercenary wrapped up in a do-or-die fight for survival.
                  </p>
                  <div className="featured-game-actions">
                    <Link href={route('login')} className="btn btn-secondary">
                      Read Reviews
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* How It Works Section */}
          <section className="features-section">
            <div className="container">
              <h2 className="section-title text-center">{t('welcome.how_it_works')}</h2>
              <p className="section-description text-center">{t('welcome.how_it_works_desc')}</p>

              <div className="features-grid">
                {features.map((feature, index) => (
                  <div className="feature-card" key={index}>
                    <div className="feature-icon">{feature.icon}</div>
                    <h3 className="feature-title">{feature.title}</h3>
                    <p className="feature-description">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Community Highlights Section with Image */}
          <section className="community-section" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${welcomeImage6})` }}>
            <div className="container">
              <div className="community-content">
                <h2 className="section-title">{t('welcome.community_highlights')}</h2>
                <p className="section-description">{t('welcome.community_highlights_desc')}</p>
                <p className="section-description">{t('welcome.feature_community_highlights_desc')}</p>
                <Link href="/community" className="btn btn-primary">
                  {t('welcome.join_discussions')}
                </Link>
              </div>
            </div>
          </section>

          {/* Footer */}
          <Footer />
        </div>
      </>
    </Provider>
  );
}
