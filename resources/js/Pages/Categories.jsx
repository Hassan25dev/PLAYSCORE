import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Inertia } from '@inertiajs/inertia';
import { Head } from '@inertiajs/react';
import MainLayout from '../Layouts/MainLayout';
import { fetchGenres, selectAllGenres, selectGenreStatus } from '../logiqueredux/genresSlice';
import {
  fetchGames,
  selectAllGames,
  selectGameStatus,
  selectGameError,
  selectCurrentPage,
  selectTotalPages,
  selectSelectedGenres,
  setSelectedGenres,
  setCurrentPage
} from '../logiqueredux/gamesSlice';
import GameCard from '../components/GameCard/GameCard';
import LoadingIndicator from '../components/LoadingIndicator';
import { useTranslation } from '../lang/translationHelper';
import '../css/Home.css';
import './categories.css';
// Import the bloodborne image directly
import bloodborne from '../images/bloodborne-3840x2160-13121.jpg';

const Categories = ({ auth }) => {
  const dispatch = useDispatch();
  const genres = useSelector(selectAllGenres);
  const genreStatus = useSelector(selectGenreStatus);
  const games = useSelector(selectAllGames);
  const gameStatus = useSelector(selectGameStatus);
  const error = useSelector(selectGameError);
  const currentPage = useSelector(selectCurrentPage);
  const totalPages = useSelector(selectTotalPages);
  const selectedGenres = useSelector(selectSelectedGenres);
  const [loading, setLoading] = useState(false);

  // Fetch genres on component mount
  useEffect(() => {
    // Set a loading timeout to prevent infinite loading
    const loadingTimeout = setTimeout(() => {
      if (genreStatus === 'loading') {
        console.warn('Genre loading timeout reached, forcing status update');
        setLoading(false);
      }
    }, 15000); // 15 seconds timeout

    dispatch(fetchGenres());

    return () => clearTimeout(loadingTimeout);
  }, [dispatch, genreStatus]);

  // Fetch games when selected genres or page changes
  useEffect(() => {
    // Only fetch games if there are selected genres
    if (selectedGenres.length === 0) {
      return;
    }

    // Set loading state
    setLoading(true);

    // Set a loading timeout to prevent infinite loading
    const loadingTimeout = setTimeout(() => {
      if (gameStatus === 'loading') {
        console.warn('Game loading timeout reached, forcing status update');
        setLoading(false);
      }
    }, 15000); // 15 seconds timeout

    try {
      // Dispatch the action to fetch games
      console.log('Dispatching fetchGames with genres:', selectedGenres.join(','));
      dispatch(fetchGames({
        page: currentPage,
        genres: selectedGenres.join(',')
      }))
        .unwrap()
        .then(data => {
          console.log('Games fetched successfully:', data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching games by genre:', error);
          setLoading(false);
        });
    } catch (error) {
      console.error('Exception in fetchGames dispatch:', error);
      setLoading(false);
    }

    return () => {
      clearTimeout(loadingTimeout);
    };
  }, [dispatch, selectedGenres, currentPage]);

  const handleGenreClick = (genreId) => {
    const newSelectedGenres = selectedGenres.includes(genreId)
      ? selectedGenres.filter(id => id !== genreId)
      : [...selectedGenres, genreId];

    dispatch(setSelectedGenres(newSelectedGenres));
    // Reset to page 1 when changing filters
    dispatch(setCurrentPage(1));
  };

  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page));
    // Scroll to top of the page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGameClick = (id) => {
    setLoading(true);
    Inertia.visit(`/jeux/${id}`);
  };

  useEffect(() => {
    if (gameStatus !== 'loading') {
      setLoading(false);
    }
  }, [gameStatus]);

  const { t } = useTranslation();

  if (genreStatus === 'loading') {
    return (
      <MainLayout auth={auth} currentUrl="/categories">
        <LoadingIndicator
          isLoading={true}
          translationKey="categories.loading_categories"
          size="md"
        />
      </MainLayout>
    );
  }

  if (gameStatus === 'failed') {
    return (
      <MainLayout auth={auth} currentUrl="/categories">
        <div className="error">{t('common.error')}: {error}</div>
      </MainLayout>
    );
  }

  if (loading) {
    return (
      <MainLayout auth={auth} currentUrl="/categories">
        <LoadingIndicator
          isLoading={true}
          translationKey="common.loading_content"
          overlay={true}
          size="lg"
        />
      </MainLayout>
    );
  }

  return (
    <MainLayout auth={auth} currentUrl="/categories">
      <Head title="Catégories de Jeux | PlayScore" />
      <div className="categories-page">
        {/* Hero Section - Exact same approach as in Jeux/Index.jsx */}
        <section className="categories-hero" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${bloodborne})` }}>
          <div className="container">
            <h1 className="categories-title">Catégories de Jeux</h1>
            <p className="categories-subtitle">Explorez les jeux par genre et découvrez de nouvelles expériences</p>
          </div>
        </section>

      <div className="categories-container">
        <div className="categories-list">
          <h2>Sélectionnez des catégories</h2>
          <div className="genre-tags">
            {genres.map(genre => (
              <div
                key={genre.id}
                className={`genre-tag ${selectedGenres.includes(genre.id) ? 'selected' : ''}`}
                onClick={() => handleGenreClick(genre.id)}
              >
                {genre.name}
              </div>
            ))}
          </div>
        </div>

        <div className="filtered-games">
          <h2>
            {selectedGenres.length === 0
              ? 'Sélectionnez des catégories pour voir les jeux'
              : `Jeux correspondants (${games.length})`}
          </h2>

          {games.length === 0 && selectedGenres.length > 0 ? (
            <div className="no-results">Aucun jeu ne correspond à ces catégories.</div>
          ) : (
            <>
              {games.length > 0 && (
                <div className="game-list">
                  {games.map((game) => (
                    <div key={game.id} onClick={() => handleGameClick(game.id)}>
                      <GameCard game={game} />
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination - Only show if we have games and more than one page */}
              {games.length > 0 && totalPages > 1 && (
                <div className="pagination">
                  {(() => {
                    const maxVisiblePages = 5;
                    const pages = [];

                    // Always show first page
                    pages.push(
                      <button
                        key={1}
                        disabled={1 === currentPage}
                        onClick={() => handlePageChange(1)}
                        className={1 === currentPage ? 'pagination-button active' : 'pagination-button'}
                      >
                        1
                      </button>
                    );

                    // Calculate range of pages to show
                    let startPage = Math.max(2, currentPage - Math.floor(maxVisiblePages / 2));
                    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 3);

                    // Adjust if we're near the beginning
                    if (startPage > 2) {
                      pages.push(
                        <span key="ellipsis-start" className="pagination-ellipsis">...</span>
                      );
                    }

                    // Add middle pages
                    for (let i = startPage; i <= endPage; i++) {
                      pages.push(
                        <button
                          key={i}
                          disabled={i === currentPage}
                          onClick={() => handlePageChange(i)}
                          className={i === currentPage ? 'pagination-button active' : 'pagination-button'}
                        >
                          {i}
                        </button>
                      );
                    }

                    // Add ellipsis before last page if needed
                    if (endPage < totalPages - 1) {
                      pages.push(
                        <span key="ellipsis-end" className="pagination-ellipsis">...</span>
                      );
                    }

                    // Always show last page if there's more than one page
                    if (totalPages > 1) {
                      pages.push(
                        <button
                          key={totalPages}
                          disabled={totalPages === currentPage}
                          onClick={() => handlePageChange(totalPages)}
                          className={totalPages === currentPage ? 'pagination-button active' : 'pagination-button'}
                        >
                          {totalPages}
                        </button>
                      );
                    }

                    return pages;
                  })()}
                </div>
              )}
            </>
          )}
        </div>
      </div>
      </div>
    </MainLayout>
  );
};

export default Categories;
