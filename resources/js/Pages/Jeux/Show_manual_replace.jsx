import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import './GameDetails.css';

const GameDetails = ({ gameDetails, screenshots }) => {
  const [selectedScreenshot, setSelectedScreenshot] = useState(null);

  const openScreenshot = (screenshot) => {
    setSelectedScreenshot(screenshot);
  };

  const closeScreenshot = () => {
    setSelectedScreenshot(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date non disponible';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  const goBack = () => {
    Inertia.visit('/jeux');
  };

  if (!gameDetails) {
    return (
      <div className="error-container">
        <div className="error">Jeu non trouvé</div>
        <button onClick={goBack} className="back-button">Retour à la liste</button>
      </div>
    );
  }

  return (
    <div className="game-details-container">
      <button onClick={goBack} className="back-button">← Retour à la liste des jeux</button>
      {/* En-tête du jeu */}
      <div 
        className="game-header" 
        style={{ backgroundImage: `url(${gameDetails.background_image})` }}
      >
        <div className="game-header-content">
          <h1>{gameDetails.name}</h1>
          <div className="game-meta">
            <span className="release-date">
              Sortie le : {formatDate(gameDetails.released)}
            </span>
            <span className="rating">
              Note : {gameDetails.rating}/5 ({gameDetails.ratings_count} votes)
            </span>
          </div>
        </div>
      </div>

      <div className="game-content">
        {/* Description */}
        <section className="description-section">
          <h2>Description</h2>
          <p>{gameDetails.description_raw}</p>
        </section>

        {/* Informations */}
        <section className="info-section">
          <h2>Informations</h2>
          <div className="info-grid">
            <div className="info-item">
              <h3>Genres</h3>
              <div className="tags">
                {gameDetails.genres?.map(genre => (
                  <span key={genre.id} className="tag">{genre.name}</span>
                ))}
              </div>
            </div>

            <div className="info-item">
              <h3>Plateformes</h3>
              <div className="tags">
                {gameDetails.platforms?.map(platform => (
                  <span key={platform.platform.id} className="tag">
                    {platform.platform.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="info-item">
              <h3>Développeurs</h3>
              <div className="tags">
                {gameDetails.developers?.map(developer => (
                  <span key={developer.id} className="tag">{developer.name}</span>
                ))}
              </div>
            </div>

            <div className="info-item">
              <h3>Éditeurs</h3>
              <div className="tags">
                {gameDetails.publishers?.map(publisher => (
                  <span key={publisher.id} className="tag">{publisher.name}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Screenshots */}
        <section className="screenshots-section">
          <h2>Captures d'écran</h2>
          <div className="screenshots-gallery">
            {screenshots?.map(screenshot => (
              <img
                key={screenshot.id}
                src={screenshot.image}
                alt="Screenshot du jeu"
                className="screenshot"
                onClick={() => openScreenshot(screenshot)}
              />
            ))}
          </div>
        </section>

        {/* Informations additionnelles */}
        <section className="additional-info">
          <h2>Informations supplémentaires</h2>
          <div className="info-grid">
            <div className="info-item">
              <h3>Site web</h3>
              {gameDetails.website ? (
                <a 
                  href={gameDetails.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="website-link"
                >
                  Visiter le site officiel
                </a>
              ) : (
                <span>Non disponible</span>
              )}
            </div>
            <div className="info-item">
              <h3>Classification ESRB</h3>
              <span>{gameDetails.esrb_rating?.name || 'Non classé'}</span>
            </div>
            <div className="info-item">
              <h3>Note Metacritic</h3>
              <span className={`metacritic-score score-${Math.floor((gameDetails.metacritic || 0) / 20)}`}>
                {gameDetails.metacritic || 'N/A'}
              </span>
            </div>
          </div>
        </section>
      </div>

      {/* Modal pour les screenshots */}
      {selectedScreenshot && (
        <div className="screenshot-modal" onClick={closeScreenshot}>
          <div className="modal-content">
            <img src={selectedScreenshot.image} alt="Screenshot en plein écran" />
            <button className="close-modal" onClick={closeScreenshot}>×</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameDetails;
