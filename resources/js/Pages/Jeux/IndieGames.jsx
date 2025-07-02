import React from 'react';
import { Head } from '@inertiajs/react';
import { t, getLocale } from '../../lang/translationHelper';
import MainLayout from '../../Layouts/MainLayout';
import GameCard from '../../components/GameCard/GameCard';
import indieHeroImage from '../../images/dark-souls-knight-3840x2160-18742.jpeg';
import '../../css/Home.css';
import './IndieGames.css';

const IndieGames = ({ auth, indieGames }) => {
  // Use the current locale from the translation helper
  const locale = getLocale();

  return (
    <MainLayout auth={auth} currentUrl="/jeux/indie">
      <Head title={t('indie_games.page_title') || 'Indie Games Showcase | PlayScore'} />

      <div className="indie-games-page">
        {/* Hero Section */}
        <section className="indie-hero" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${indieHeroImage})` }}>
          <div className="container">
            <h1 className="indie-title">{t('indie_games.hero_title') || 'Indie Games Showcase'}</h1>
            <p className="indie-subtitle">
              {t('indie_games.hero_subtitle') || 'Discover amazing games from independent developers'}
            </p>
          </div>
        </section>

        <div className="indie-games-container">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">{t('indie_games.section_title') || 'Indie Games'}</h2>
              <p className="section-description">
                {t('indie_games.section_description') || 'Support independent developers by discovering and playing their creative works'}
              </p>
            </div>

            {indieGames && indieGames.length > 0 ? (
              <div className="indie-games-grid">
                {indieGames.map((game) => (
                  <div key={game.id} className="indie-game-card-wrapper">
                    <GameCard game={game} />
                    {game.developer && (
                      <div className="indie-developer-badge">
                        {t('indie_games.by_developer', { developer: game.developer }) || `By ${game.developer}`}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-games-message">
                <div className="no-games-icon">🎮</div>
                <p>{t('indie_games.no_games') || 'No indie games available at the moment. Check back soon!'}</p>
              </div>
            )}
          </div>
        </div>

        <section className="indie-support-section">
          <div className="container">
            <h2>{t('indie_games.support_title') || 'Support Independent Game Development'}</h2>
            <p>
              {t('indie_games.support_description') ||
                'Independent game developers often work with limited resources but unlimited creativity. By playing and sharing indie games, you help these developers continue to create innovative and unique gaming experiences.'}
            </p>

            <div className="indie-features">
              <div className="indie-feature">
                <div className="indie-feature-icon">💡</div>
                <h3>{t('indie_games.feature_innovation') || 'Innovation'}</h3>
                <p>{t('indie_games.feature_innovation_desc') || 'Indie developers often experiment with new gameplay mechanics and storytelling techniques.'}</p>
              </div>

              <div className="indie-feature">
                <div className="indie-feature-icon">🎨</div>
                <h3>{t('indie_games.feature_creativity') || 'Creativity'}</h3>
                <p>{t('indie_games.feature_creativity_desc') || 'Without corporate constraints, indie developers can express their unique creative vision.'}</p>
              </div>

              <div className="indie-feature">
                <div className="indie-feature-icon">❤️</div>
                <h3>{t('indie_games.feature_passion') || 'Passion'}</h3>
                <p>{t('indie_games.feature_passion_desc') || 'Indie games are often passion projects, created with love and dedication by small teams.'}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default IndieGames;
