import React, { useState, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { useDispatch } from 'react-redux';
import { rateGame } from '../../logiqueredux/gamesSlice';
import VideoModal from '../VideoModal/VideoModal';
import { getPlaceholderImage, preloadPlaceholder } from '../../utils/placeholderImages';
import './GameCard.css';

const GameCard = ({ game, isActive, onSelect }) => {
  const dispatch = useDispatch();
  const [userRating, setUserRating] = useState(game?.rating || game?.note || 0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isFullscreenModalOpen, setIsFullscreenModalOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState('');

  if (!game) {
    return null;
  }

  // Determine if the game has a video
  const hasVideo = game.video_path || game.video_url;

  // Determine the video source
  let videoSrc = '';
  if (game.video_path) {
    videoSrc = game.video_path.includes('/storage/')
      ? game.video_path
      : `/storage/${game.video_path}`;
  } else if (game.video_url) {
    videoSrc = game.video_url;
  }

  // Function to get a reliable image URL
  const getReliableImageUrl = () => {
    if (!game.background_image) {
      return null;
    }

    // For RAWG images, ensure they're properly formatted
    if (game.background_image.includes('media.rawg.io')) {
      return game.background_image;
    }

    // For storage paths, ensure they have the proper prefix
    if (!game.background_image.startsWith('/') && !game.background_image.startsWith('http')) {
      return `/storage/${game.background_image}`;
    }

    // For all other cases, return as is
    return game.background_image;
  };

  // Get a placeholder image URL based on game name and genres
  const getGamePlaceholder = () => {
    return getPlaceholderImage(
      game.name || game.titre,
      game.genres || []
    );
  };

  // Initialize image source and preload placeholder
  useEffect(() => {
    // Set initial image source
    setImageSrc(getReliableImageUrl());

    // Preload the placeholder image
    preloadPlaceholder(game.name || game.titre, game.genres || []);
  }, [game.id, game.background_image]);

  const handleClick = (e) => {
    e.preventDefault();
    if (onSelect) {
      onSelect(game.id);
    }
    if (game.id) {
      Inertia.visit(`/jeux/${game.id}`);
    }
  };

  const handleRating = (newRating, e) => {
    e.stopPropagation();
    if (game.id) {
      setUserRating(newRating);
      dispatch(rateGame({ gameId: game.id, rating: newRating }));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date non spécifiée';

    // Parse the date
    const date = new Date(dateString);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return 'Date non spécifiée';
    }

    // Check if the date is in the future (more than 1 year from now)
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

    if (date > oneYearFromNow) {
      // If the date is far in the future (like 2030-2033), it's likely a placeholder
      // Return "À venir" (Coming soon) instead
      return 'À venir';
    }

    // Format the date normally
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('fr-FR', options);
  };

  // Handle closing the fullscreen video modal
  const handleCloseFullscreen = () => {
    setIsFullscreenModalOpen(false);
  };

  return (
    <div
      className={`game-card${isActive ? ' active' : ''}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick(e);
        }
      }}
      aria-pressed={isActive}
    >
      <div className="game-card-image-wrapper">
        {imageSrc ? (
          <>
            <img
              src={imageSrc}
              alt={`${game.name || game.titre || 'Game'} cover`}
              className="game-card-image"
              loading="eager"
              decoding="async"
              onLoad={() => setImageLoaded(true)}
              onError={(e) => {
                console.log(`Image error for game ${game.id} - ${game.name || game.titre}`);
                e.target.onerror = null;
                setImageError(true);

                // Use our custom placeholder based on game genre
                const placeholderUrl = getGamePlaceholder();
                console.log(`Using genre-based placeholder: ${placeholderUrl}`);
                e.target.src = placeholderUrl;
              }}
              style={{
                opacity: imageLoaded ? 1 : 0,
                transition: 'opacity 0.3s ease-in-out'
              }}
            />
            {!imageLoaded && (
              <div className="image-loading-placeholder">
                <div className="loading-spinner"></div>
              </div>
            )}
          </>
        ) : (
          <div className="game-card-image placeholder">
            <span>Image non disponible</span>
          </div>
        )}
        <h2 className="game-card-title">{game.name || game.titre}</h2>
      </div>

      <div className="game-card-content">
        <div className="game-card-info">
          {(game.description_raw || game.description) ? (
            <p className="game-description">
              {`${(game.description_raw || game.description).slice(0, 150)}...`}
            </p>
          ) : null}

          <p className="game-release-date">
            Date de sortie : {formatDate(game.released || game.date_sortie)}
          </p>

          <div className="game-platforms">
            {game.platforms && Array.isArray(game.platforms) && game.platforms.length > 0 && (
              <p>
                Plateformes : {game.platforms.map(p =>
                  p.platform ? p.platform.name : (typeof p === 'string' ? p : '')
                ).filter(Boolean).join(', ')}
              </p>
            )}
          </div>
        </div>

        <div className="rating-section" onClick={(e) => e.stopPropagation()}>
          <p className="current-rating">
            Note globale : {(game.rating || game.note) ? `${game.rating || game.note}/5` : 'Non noté'}
          </p>

          <div className="rating-container">
            <div className="stars-container">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={(e) => handleRating(star, e)}
                  className={`rating-star ${userRating >= star ? 'active' : ''}`}
                  aria-label={`Noter ${star} étoiles`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Video Modal */}
      {hasVideo && (
        <VideoModal
          videoSrc={videoSrc}
          isOpen={isFullscreenModalOpen}
          onClose={handleCloseFullscreen}
        />
      )}
    </div>
  );
};

export default GameCard;
