import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Inertia } from '@inertiajs/inertia';
import { Head } from '@inertiajs/react';
import { fetchGenres, selectAllGenres, selectGenreStatus } from '../../logiqueredux/genresSlice';
import {
  fetchGames,
  selectAllGames,
  selectGameStatus,
  selectTotalCount,
  selectCurrentPage,
  setSelectedGenres,
  selectSelectedGenres
} from '../../logiqueredux/gamesSlice';
import GameCard from '../../components/GameCard/GameCard';
import MainLayout from '../../Layouts/MainLayout';
import { scrollToTop } from '../../utils/scrollUtils';
import { savePaginationState } from '../../utils/paginationStateUtils';
import { t } from '../../lang/translationHelper';
import '../../css/Home.css';
import '../categories.css';
import bloodborne from '../../images/bloodborne-3840x2160-13121.jpg';

const CategoriesIndex = ({ auth }) => {
  const dispatch = useDispatch();
  const genres = useSelector(selectAllGenres);
  const genreStatus = useSelector(selectGenreStatus);
  const games = useSelector(selectAllGames);
  const gameStatus = useSelector(selectGameStatus);
  const totalCount = useSelector(selectTotalCount);
  const [loading, setLoading] = useState(false);
  // Use Redux state for selected genres instead of local state
  const reduxSelectedGenres = useSelector(selectSelectedGenres);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFiltering, setIsFiltering] = useState(false);

  // Fetch genres on component mount
  useEffect(() => {
    dispatch(fetchGenres());
  }, [dispatch]);

  // Initialize local state from Redux on mount
  useEffect(() => {
    // If there are already selected genres in Redux, use them
    if (reduxSelectedGenres.length > 0) {
      setIsFiltering(true);
      console.log('Fetching games with genres:', reduxSelectedGenres.join(','));
    }
  }, [reduxSelectedGenres]);

  // Fetch games when selected genres change
  useEffect(() => {
    if (reduxSelectedGenres.length > 0) {
      setIsFiltering(true);
      console.log('Fetching games with genres:', reduxSelectedGenres.join(','));
      dispatch(fetchGames({ genres: reduxSelectedGenres.join(',') }));
    } else {
      setIsFiltering(false);
    }
  }, [dispatch, reduxSelectedGenres]);

  // Filter genres based on search term
  const filteredGenres = useMemo(() => {
    if (!searchTerm.trim()) return genres;
    return genres.filter(genre =>
      genre.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [genres, searchTerm]);

  // Get selected genre names for display
  const selectedGenreNames = useMemo(() => {
    return reduxSelectedGenres.map(id => {
      const genre = genres.find(g => g.id === id);
      return genre ? genre.name : '';
    }).filter(name => name !== '');
  }, [reduxSelectedGenres, genres]);

  const handleGenreClick = (genreId) => {
    // Update Redux state instead of local state
    dispatch(setSelectedGenres(
      reduxSelectedGenres.includes(genreId)
        ? reduxSelectedGenres.filter(id => id !== genreId)
        : [...reduxSelectedGenres, genreId]
    ));

    // Scroll to top of results when changing filters
    const resultsElement = document.querySelector('.filtered-games');
    if (resultsElement) {
      setTimeout(() => {
        resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  const handleRemoveGenre = (genreId) => {
    // Update Redux state
    dispatch(setSelectedGenres(
      reduxSelectedGenres.filter(id => id !== genreId)
    ));
  };

  const handleClearAllFilters = () => {
    // Clear Redux state
    dispatch(setSelectedGenres([]));
    setSearchTerm('');
    scrollToTop();
  };

  const currentPage = useSelector(selectCurrentPage);

  const handleGameClick = (id) => {
    setLoading(true);
    scrollToTop(false); // Instant scroll to top before navigation

    // Save pagination state before navigating to game details
    savePaginationState({
      page: currentPage,
      source: 'categories',
      filters: { genres: reduxSelectedGenres.join(',') }
    });

    Inertia.visit(`/jeux/${id}`);
  };

  useEffect(() => {
    if (gameStatus !== 'loading') {
      setLoading(false);
    }
  }, [gameStatus]);

  if (genreStatus === 'loading') {
    return (
      <MainLayout auth={auth} currentUrl="/categories">
        <div className="loading-container">
          <div className="spinner" />
          {t('common.loading')}
        </div>
      </MainLayout>
    );
  }

  if (loading) {
    return (
      <MainLayout auth={auth} currentUrl="/categories">
        <div className="loading-overlay">
          <div className="spinner" />
          {t('common.loading')}
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout auth={auth} currentUrl="/categories">
      <Head title={t('categories.page_title')} />
      <div className="categories-page">
        {/* Hero Section with Bloodborne Image */}
        <section className="categories-hero" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${bloodborne})` }}>
          <div className="container">
            <h1 className="categories-title">{t('categories.hero_title')}</h1>
            <p className="categories-subtitle">{t('categories.hero_subtitle')}</p>
          </div>
        </section>

        <div className="categories-container">
          <div className="categories-list">
            <h2>{t('categories.select_categories')}</h2>

            <div className="filter-controls">
              <div className="filter-search">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                </svg>
                <input
                  type="text"
                  placeholder={t('categories.search_placeholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="filter-actions">
                {reduxSelectedGenres.length > 0 && (
                  <button
                    className="filter-action-btn clear"
                    onClick={handleClearAllFilters}
                  >
                    {t('categories.clear_all')}
                  </button>
                )}
              </div>
            </div>

            <div className="genre-tags">
              {filteredGenres.length === 0 ? (
                <div className="no-results">{t('categories.no_categories_found')}</div>
              ) : (
                filteredGenres.map(genre => (
                  <div
                    key={genre.id}
                    className={`genre-tag ${reduxSelectedGenres.includes(genre.id) ? 'selected' : ''}`}
                    onClick={() => handleGenreClick(genre.id)}
                  >
                    {genre.name}
                    {genre.game_count > 0 && (
                      <span className="genre-tag-count">{genre.game_count}</span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="filtered-games">
            <h2>
              {reduxSelectedGenres.length === 0
                ? t('categories.select_to_see_games')
                : t('categories.matching_games', { count: totalCount || games.length })}
            </h2>

            {reduxSelectedGenres.length > 0 && (
              <>
                <div className="selected-filters">
                  {selectedGenreNames.map((name, index) => {
                    const genreId = reduxSelectedGenres[index];
                    return (
                      <div key={genreId} className="selected-filter">
                        <span>{name}</span>
                        <div
                          className="remove-filter"
                          onClick={() => handleRemoveGenre(genreId)}
                        >
                          ×
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="game-list">
                  {isFiltering && gameStatus === 'loading' ? (
                    <div className="loading-container">
                      <div className="spinner" />
                      {t('categories.searching_games')}
                    </div>
                  ) : games.length === 0 ? (
                    <div className="no-results">
                      <div className="no-results-icon">🎮</div>
                      {t('categories.no_matching_games')}
                    </div>
                  ) : (
                    games.map((game) => (
                      <div key={game.id} onClick={() => handleGameClick(game.id)}>
                        <GameCard game={game} />
                      </div>
                    ))
                  )}
                </div>
              </>
            )}

            {reduxSelectedGenres.length === 0 && (
              <div className="no-results">
                <div className="no-results-icon">🎯</div>
                {t('categories.select_to_discover')}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CategoriesIndex;