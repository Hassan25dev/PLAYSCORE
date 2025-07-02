import React, { useState, useEffect, useRef } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Link, useForm, usePage } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';
import ReviewsSection from '../../components/Reviews/ReviewsSection';
import LoadingIndicator from '../../components/LoadingIndicator';
import { t } from '../../lang/translationHelper';
import { getPaginationState, getReturnUrl } from '../../utils/paginationStateUtils';
import './GameDetails.css';

const GameDetails = ({ auth, gameDetails, screenshots, userInteractions, reviews = [] }) => {
  const { props } = usePage();
  const [selectedScreenshot, setSelectedScreenshot] = useState(null);
  const [rating, setRating] = useState(userInteractions?.userRating || 0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [currentScreenshotIndex, setCurrentScreenshotIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const screenshotsGalleryRef = useRef(null);

  // Check if the user is a regular user (not admin or developer)
  const isRegularUser = () => {
    if (!auth || !auth.user) return false;
    return auth.user.role !== 'admin' && auth.user.role !== 'developer' && !auth.user.is_developer;
  };

  // Add loading state tracking
  useEffect(() => {
    const handleStart = () => setIsLoading(true);
    const handleComplete = () => setIsLoading(false);

    document.addEventListener('inertia:start', handleStart);
    document.addEventListener('inertia:finish', handleComplete);

    return () => {
      document.removeEventListener('inertia:start', handleStart);
      document.removeEventListener('inertia:finish', handleComplete);
    };
  }, []);

  // Handle modal touch events with non-passive listeners
  useEffect(() => {
    if (selectedScreenshot) {
      const modalElement = document.querySelector('.screenshot-modal');
      if (modalElement) {
        // Custom touch handler that prevents default
        const handleTouch = (e) => {
          if (e.touches && e.touches.length === 2) {
            e.preventDefault();
          }
        };

        // Add non-passive touch event listeners
        modalElement.addEventListener('touchstart', handleTouch, { passive: false });
        modalElement.addEventListener('touchmove', handleTouch, { passive: false });

        return () => {
          // Clean up event listeners
          modalElement.removeEventListener('touchstart', handleTouch);
          modalElement.removeEventListener('touchmove', handleTouch);
        };
      }
    }
  }, [selectedScreenshot]);

  // Forms for user interactions
  const wishlistForm = useForm({
    game_id: userInteractions?.gameId || null,
  });



  const ratingForm = useForm({
    game_id: userInteractions?.gameId || null,
    rating: userInteractions?.userRating || 0,
    comment: '',
  });

  const openScreenshot = (screenshot, index, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setSelectedScreenshot(screenshot);
    setCurrentScreenshotIndex(index);
    setIsZoomed(false);
    setZoomScale(1);
    setZoomPosition({ x: 0, y: 0 });
  };

  const closeScreenshot = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setSelectedScreenshot(null);
    setIsZoomed(false);
    setZoomScale(1);
    setZoomPosition({ x: 0, y: 0 });
  };

  const navigateScreenshot = (direction, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!screenshots || screenshots.length === 0) return;

    let newIndex = currentScreenshotIndex + direction;

    // Handle wrapping around the gallery
    if (newIndex < 0) newIndex = screenshots.length - 1;
    if (newIndex >= screenshots.length) newIndex = 0;

    setCurrentScreenshotIndex(newIndex);
    setSelectedScreenshot(screenshots[newIndex]);
    setIsZoomed(false);
    setZoomScale(1);
    setZoomPosition({ x: 0, y: 0 });
  };

  const handleScreenshotScroll = () => {
    if (!screenshotsGalleryRef.current || !screenshots || screenshots.length === 0) return;

    const gallery = screenshotsGalleryRef.current;
    const scrollPosition = gallery.scrollLeft;
    const itemWidth = gallery.scrollWidth / screenshots.length;
    const newIndex = Math.round(scrollPosition / itemWidth);

    if (newIndex !== currentScreenshotIndex) {
      setCurrentScreenshotIndex(newIndex);
    }
  };

  const scrollToScreenshot = (index) => {
    if (!screenshotsGalleryRef.current || !screenshots || screenshots.length === 0) return;

    const gallery = screenshotsGalleryRef.current;
    const itemWidth = gallery.scrollWidth / screenshots.length;
    gallery.scrollTo({
      left: index * itemWidth,
      behavior: 'smooth'
    });

    setCurrentScreenshotIndex(index);
  };

  const handlePinchZoom = (e) => {
    if (!selectedScreenshot) return;

    // Only try to prevent default for pinch gestures
    if (e.touches && e.touches.length === 2) {
      // We don't call preventDefault here to avoid the passive listener warning
      e.stopPropagation();

      // Calculate the distance between the two touch points
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) +
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );

      // Use the distance to determine zoom level (simplified)
      const newZoomScale = Math.max(1, Math.min(3, distance / 100));
      setZoomScale(newZoomScale);
      setIsZoomed(newZoomScale > 1);

      // Calculate center point for positioning
      const centerX = (touch1.clientX + touch2.clientX) / 2;
      const centerY = (touch1.clientY + touch2.clientY) / 2;

      // Set position relative to center of screen
      setZoomPosition({
        x: (window.innerWidth / 2 - centerX) * 0.5,
        y: (window.innerHeight / 2 - centerY) * 0.5
      });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return t('game_details.date_not_available');
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    // Use the current locale from the browser
    const locale = document.documentElement.lang || 'fr-FR';
    return new Date(dateString).toLocaleDateString(locale, options);
  };

  const goBack = () => {
    // Check if we have saved pagination state
    const savedState = getPaginationState();

    if (savedState) {
      // Navigate to the saved page with correct pagination
      const returnUrl = getReturnUrl(savedState);
      Inertia.visit(returnUrl);
    } else if (window.history.length > 1) {
      // Fall back to browser history if no saved state
      window.history.back();
    } else {
      // Default fallback
      Inertia.visit('/jeux');
    }
  };

  // Handler for adding/removing from wishlist
  const handleWishlist = () => {
    if (!auth) {
      alert('Please log in to add games to your wishlist');
      return;
    }

    if (!isRegularUser()) {
      alert('Only regular users can add games to their wishlist');
      return;
    }

    if (userInteractions?.inWishlist) {
      Inertia.delete(route('wishlist.destroy', userInteractions.gameId));
    } else {
      wishlistForm.post(route('wishlist.store'));
    }
  };



  // Handler for rating a game
  const handleRating = (value) => {
    if (!auth) {
      alert('Please log in to rate games');
      return;
    }

    if (!isRegularUser()) {
      alert('Only regular users can rate games');
      return;
    }

    setRating(value);
    ratingForm.data.rating = value;
    ratingForm.post(route('ratings.store'));
  };

  // Render star rating component
  const renderStars = () => {
    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${star <= (hoveredRating || rating) ? 'filled' : ''}`}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            onClick={() => handleRating(star)}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <MainLayout auth={auth}>
        <div className="game-details-container">
          <LoadingIndicator
            isLoading={true}
            translationKey="game_details.loading"
            overlay={true}
            size="lg"
          />
        </div>
      </MainLayout>
    );
  }

  // Error state
  if (!gameDetails) {
    // Get saved pagination state for the back button text
    const savedState = getPaginationState();
    const backButtonText = savedState && savedState.page > 1
      ? `${t('game_details.back_to_list')} (${t('game_details.page')} ${savedState.page})`
      : t('game_details.back_to_list');

    return (
      <MainLayout auth={auth}>
        <div className="error-container">
          <div className="error">{t('game_details.game_not_found')}</div>
          <button onClick={goBack} className="back-button">{backButtonText}</button>
        </div>
      </MainLayout>
    );
  }

  // Get saved pagination state for the back button text
  const savedState = getPaginationState();
  const backButtonText = savedState && savedState.page > 1
    ? `${t('game_details.back_to_games_list')} (${t('game_details.page')} ${savedState.page})`
    : t('game_details.back_to_games_list');

  return (
    <MainLayout auth={auth}>
      <div className="game-details-container">
        <button onClick={goBack} className="back-button">{backButtonText}</button>
        {/* Game header */}
        <div
          className="game-header"
          style={{
            backgroundImage: gameDetails.background_image ?
              (gameDetails.background_image.startsWith('http') ?
                `url(${gameDetails.background_image})` :
                `url(/storage/${gameDetails.background_image})`) :
              'none'
          }}
        >
          <div className="game-header-content">
            <h1>{gameDetails.name}</h1>
            <div className="game-meta">
              <span className="release-date">
                {t('game_details.released_on')}: {formatDate(gameDetails.released)}
              </span>
              <span className="rating">
                {t('game_details.rating')}: {gameDetails.rating}/5 ({gameDetails.ratings_count} {t('game_details.votes')})
              </span>
            </div>

            {/* User interaction buttons - only shown for authenticated regular users */}
            {auth && userInteractions && isRegularUser() && (
              <div className="user-interactions">
                <div className="interaction-buttons">
                  <button
                    className={`wishlist-button ${userInteractions.inWishlist ? 'active' : ''}`}
                    onClick={handleWishlist}
                    title={userInteractions.inWishlist ? t('game.remove_from_wishlist') : t('game.add_to_wishlist')}
                  >
                    <i className={`fa ${userInteractions.inWishlist ? 'fa-heart' : 'fa-heart-o'}`}></i>
                    {userInteractions.inWishlist ? t('game_details.in_wishlist') : t('game.add_to_wishlist')}
                  </button>
                </div>

                <div className="rating-container">
                  <span className="rating-label">{t('game_details.your_rating')}:</span>
                  {renderStars()}
                </div>
              </div>
            )}
          </div>
        </div>

      <div className="game-content">
        {/* Description */}
        <section className="description-section">
          <h2>{t('game.description')}</h2>
          <p>{gameDetails.description_raw}</p>
        </section>

        {/* Informations */}
        <section className="info-section">
          <h2>{t('game_details.information')}</h2>
          <div className="info-grid">
            <div className="info-item">
              <h3>{t('game.genres')}</h3>
              <div className="tags">
                {gameDetails.genres?.map(genre => (
                  <span key={genre.id} className="tag" data-category="genre">{genre.name}</span>
                ))}
              </div>
            </div>

            <div className="info-item">
              <h3>{t('game.platforms')}</h3>
              <div className="tags">
                {gameDetails.platforms?.map(platform => (
                  <span key={platform.platform.id} className="tag" data-category="platform">
                    {platform.platform.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="info-item">
              <h3>{t('game.developer')}</h3>
              <div className="tags">
                {gameDetails.developers?.map(developer => (
                  <span key={developer.id} className="tag" data-category="developer">{developer.name}</span>
                ))}
              </div>
            </div>

            <div className="info-item">
              <h3>{t('game_details.publishers')}</h3>
              <div className="tags">
                {gameDetails.publishers?.map(publisher => (
                  <span key={publisher.id} className="tag" data-category="publisher">{publisher.name}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Screenshots */}
        <section className="screenshots-section">
          <h2>{t('game_details.screenshots')}</h2>
          <div
            className="screenshots-gallery"
            ref={screenshotsGalleryRef}
            onScroll={handleScreenshotScroll}
          >
            {screenshots?.map((screenshot, index) => (
              <img
                key={screenshot.id}
                src={screenshot.image}
                alt={t('game_details.game_screenshot')}
                className={`screenshot ${currentScreenshotIndex === index ? 'active' : ''}`}
                onClick={(e) => openScreenshot(screenshot, index, e)}
                loading="lazy"
              />
            ))}
          </div>

          {/* Navigation dots for mobile */}
          {screenshots && screenshots.length > 1 && (
            <div className="screenshot-navigation-dots">
              {screenshots.map((_, index) => (
                <button
                  key={index}
                  className={`nav-dot ${currentScreenshotIndex === index ? 'active' : ''}`}
                  onClick={() => scrollToScreenshot(index)}
                  aria-label={`View screenshot ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Tablet-specific gallery controls */}
          {screenshots && screenshots.length > 1 && (
            <div className="tablet-gallery-controls">
              <button
                className="tablet-gallery-button"
                onClick={(e) => navigateScreenshot(-1, e)}
                aria-label={t('game_details.previous_screenshot')}
              >
                ‹
              </button>

              <div className="tablet-gallery-indicator">
                {currentScreenshotIndex + 1} / {screenshots.length}
              </div>

              <button
                className="tablet-gallery-button"
                onClick={(e) => navigateScreenshot(1, e)}
                aria-label={t('game_details.next_screenshot')}
              >
                ›
              </button>
            </div>
          )}
        </section>

        {/* Additional Information */}
        <section className="additional-info">
          <h2>{t('game_details.additional_information')}</h2>
          <div className="info-grid">
            <div className="info-item">
              <h3>{t('game_details.website')}</h3><br/>
              {gameDetails.website ? (
                <a
                  href={gameDetails.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="website-link"
                >
                  {t('game_details.visit_official_site')}
                </a>
              ) : (
                <span>{t('game_details.not_available')}</span>
              )}
            </div>
            <div className="info-item">
              <h3>{t('game_details.esrb_rating')}</h3><br/>
              <span>{gameDetails.esrb_rating?.name || t('game_details.not_rated')}</span>
            </div>
            <div className="info-item">
              <h3>{t('game_details.metacritic_score')}</h3><br/>
              <span className={`metacritic-score score-${Math.floor((gameDetails.metacritic || 0) / 20)}`}>
                {gameDetails.metacritic || 'N/A'}
              </span>
            </div>
          </div>
        </section>

        {/* Reviews Section - only shown for regular users */}
        {isRegularUser() && (
          <ReviewsSection
            auth={auth}
            gameId={userInteractions?.gameId}
            reviews={reviews}
          />
        )}
      </div>

      {/* Screenshot modal */}
      {selectedScreenshot && (
        <div
          className="screenshot-modal"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            closeScreenshot();
          }}
          onTouchMove={handlePinchZoom}
          onTouchStart={(e) => {
            e.stopPropagation();
          }}
        >
          <div
            className="modal-content"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <img
              src={selectedScreenshot.image}
              alt={t('game_details.fullscreen_screenshot')}
              style={{
                transform: isZoomed ? `scale(${zoomScale}) translate(${zoomPosition.x}px, ${zoomPosition.y}px)` : 'none',
                transition: isZoomed ? 'none' : 'transform 0.3s ease',
                touchAction: 'none' // Disable browser's default touch actions
              }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            />
            <button
              className="close-modal"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                closeScreenshot();
              }}
              aria-label={t('game_details.close')}
            >
              ×
            </button>

            {/* Mobile navigation arrows */}
            {screenshots && screenshots.length > 1 && (
              <>
                <button
                  className="modal-nav-button prev"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    navigateScreenshot(-1, e);
                  }}
                  aria-label={t('game_details.previous_screenshot')}
                >
                  ‹
                </button>
                <button
                  className="modal-nav-button next"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    navigateScreenshot(1, e);
                  }}
                  aria-label={t('game_details.next_screenshot')}
                >
                  ›
                </button>
              </>
            )}

            {/* Mobile screenshot counter */}
            {screenshots && screenshots.length > 1 && (
              <div className="screenshot-counter">
                {currentScreenshotIndex + 1} / {screenshots.length}
              </div>
            )}

            {/* Mobile pinch-to-zoom hint */}
            <div className="mobile-zoom-hint">
              {isZoomed ? t('game_details.pinch_to_zoom_out') : t('game_details.pinch_to_zoom_in')}
            </div>
          </div>
        </div>
      )}
    </div>
    </MainLayout>
  );
};

export default GameDetails;
