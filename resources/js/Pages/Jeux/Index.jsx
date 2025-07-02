import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Inertia } from '@inertiajs/inertia';
import { Head, usePage } from '@inertiajs/react';
import GameCard from '../../components/GameCard/GameCard';
import MainLayout from '../../Layouts/MainLayout';
import LoadingIndicator from '../../components/LoadingIndicator';
import { scrollToTop } from '../../utils/scrollUtils';
import { savePaginationState } from '../../utils/paginationStateUtils';
import { useTranslation } from '../../lang/translationHelper';
import '../../css/Home.css';
import './GamesList.css';
import cyberpunk from '../../images/Cyberpunk.jpg';
import {
  fetchGames,
  selectAllGames,
  selectGameStatus,
  selectGameError,
  selectCurrentPage,
  selectTotalPages,
  selectSearchQuery,
  setCurrentPage,
  setSearchQuery,
} from '../../logiqueredux/gamesSlice';

const JeuxIndex = ({ jeux, auth }) => {
  const { url } = usePage();
  const dispatch = useDispatch();
  const games = useSelector(selectAllGames);
  const status = useSelector(selectGameStatus);
  const error = useSelector(selectGameError);
  const currentPage = useSelector(selectCurrentPage);
  const totalPages = useSelector(selectTotalPages);
  const searchQuery = useSelector(selectSearchQuery);

  // Get parameters from the URL
  const urlParams = new URLSearchParams(url.split('?')[1] || '');
  const sortParam = urlParams.get('sort') || 'popularity';
  const urlSearchQuery = urlParams.get('search') || '';

  const [loading, setLoading] = useState(false);

  // Set search query from URL when component mounts or when URL changes
  useEffect(() => {
    if (urlSearchQuery && urlSearchQuery !== searchQuery) {
      console.log('Setting search query from URL:', urlSearchQuery);
      dispatch(setSearchQuery(urlSearchQuery));
    } else if (!urlSearchQuery && searchQuery) {
      // If URL has no search query but Redux store does, clear it
      console.log('Clearing search query from Redux store');
      dispatch(setSearchQuery(''));
    }
  }, [urlSearchQuery, searchQuery, dispatch]);

  // Initialize games from API on component mount
  useEffect(() => {
    // Set loading state
    setLoading(true);

    // Set a loading timeout to prevent infinite loading
    const loadingTimeout = setTimeout(() => {
      if (status === 'loading') {
        console.warn('Loading timeout reached, forcing status update');
        setLoading(false);
      }
    }, 15000); // 15 seconds timeout

    // Track if the component is still mounted
    let isMounted = true;

    const fetchData = async () => {
      try {
        // Dispatch the action to fetch games
        console.log('Dispatching fetchGames with page:', currentPage, 'search:', searchQuery, 'sort:', sortParam);

        const result = await dispatch(fetchGames({
          page: currentPage,
          search: searchQuery,
          sort: sortParam
        })).unwrap();

        if (isMounted) {
          console.log('Games fetched successfully:', result);
          // Log detailed pagination information
          console.log('Pagination info:', {
            totalCount: result.count,
            totalPages: Math.ceil(result.count / 20),
            currentPage: currentPage,
            resultsCount: result.results.length,
            hasNext: !!result.next,
            hasPrevious: !!result.previous
          });
          setLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error fetching games:', error);
          setLoading(false);

          // Show more detailed error information in console for debugging
          if (error.name === 'AbortError') {
            console.warn('Search request was aborted (timeout)');
          } else if (error.message && error.message.includes('Failed to fetch')) {
            console.error('Network error during search. API might be unavailable.');
          } else {
            console.error('Unexpected error during search:', error);
          }
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
      clearTimeout(loadingTimeout);
    };
  }, [dispatch, currentPage, searchQuery, sortParam]); // Added sortParam to dependencies

  const handlePageChange = (page) => {
    console.log('Changing page to:', page);

    // Only dispatch if the page is different from the current page
    if (page !== currentPage) {
      dispatch(setCurrentPage(page));
      setLoading(true); // Set loading state when changing page
      scrollToTop();

      // Dispatch fetchGames with the new page to fetch correct data
      dispatch(fetchGames({
        page: page,
        search: searchQuery,
        sort: sortParam
      }));
    }
  };

  const handleGameClick = (id) => {
    setLoading(true);
    scrollToTop(false); // Instant scroll to top before navigation

    // Save pagination state before navigating to game details
    savePaginationState({
      page: currentPage,
      source: 'jeux',
      search: searchQuery,
      sort: sortParam
    });

    Inertia.visit(`/jeux/${id}`);
  };

  useEffect(() => {
    if (status !== 'loading') {
      setLoading(false);
    }
  }, [status]);

  const { t } = useTranslation();

  if (status === 'failed') {
    // Create a more user-friendly error message
    let errorMessage = error;

    if (error && error.includes('Failed to fetch')) {
      errorMessage = t('common.network_error') || 'Network error. Please check your connection and try again.';
    } else if (error && error.includes('AbortError')) {
      errorMessage = t('common.timeout_error') || 'The request timed out. Please try again.';
    } else if (error && error.includes('API Error')) {
      errorMessage = t('common.api_error') || 'There was a problem with the search service. Please try again later.';
    }

    return (
      <MainLayout auth={auth} currentUrl="/jeux">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <div className="error-message">
            <h3>{t('common.error_title') || 'Search Error'}</h3>
            <p>{errorMessage}</p>
            <button
              className="retry-button"
              onClick={() => {
                // Retry the search
                dispatch(fetchGames({ page: currentPage, search: searchQuery, sort: sortParam }));
                setLoading(true);
              }}
            >
              {t('common.retry') || 'Retry'}
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (loading) {
    return (
      <MainLayout auth={auth} currentUrl="/jeux">
        <LoadingIndicator
          isLoading={true}
          translationKey="common.loading_content"
          overlay={true}
          size="lg"
        />
      </MainLayout>
    );
  }

  // Use games from Redux store, or fall back to props if store is empty
  const displayGames = games && games.length > 0 ? games : (jeux?.data || []);

  if (!displayGames || displayGames.length === 0) {
    return (
      <MainLayout auth={auth} currentUrl="/jeux">
        <div className="no-results-container">
          <div className="no-results-icon">🔍</div>
          <h3>{t('common.no_results_title') || 'No Games Found'}</h3>
          <p>
            {searchQuery
              ? t('common.no_results_search', {query: searchQuery}) || `No games found matching "${searchQuery}".`
              : t('common.no_results') || 'No games found.'}
          </p>
          {searchQuery && (
            <button
              className="clear-search-button"
              onClick={() => {
                dispatch(setSearchQuery(''));
                Inertia.visit('/jeux');
              }}
            >
              {t('common.clear_search') || 'Clear Search'}
            </button>
          )}
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout auth={auth} currentUrl="/jeux">
      <Head title="Liste des Jeux | PlayScore" />
      <div className="games-page">
        {/* Hero Section */}
        <section className="games-hero" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${cyberpunk})` }}>
          <div className="container">
            <h1 className="games-title">Découvrez Notre Collection de Jeux</h1>
            <p className="games-subtitle">Explorez notre vaste bibliothèque de jeux à travers toutes les plateformes et genres</p>
          </div>
        </section>

        <div className="home">
          <h2 className="section-title">Liste des Jeux</h2>
          <div className="game-list">
            {/* Sort games based on the sort parameter from URL */}
            {[...displayGames]
              .sort((a, b) => {
                if (sortParam === 'recent') {
                  // Sort by release date (newest first)
                  const dateA = a.released ? new Date(a.released) : new Date(0);
                  const dateB = b.released ? new Date(b.released) : new Date(0);
                  return dateB - dateA;
                } else if (sortParam === 'rating') {
                  // Sort by rating (highest first)
                  const ratingA = a.rating || 0;
                  const ratingB = b.rating || 0;
                  return ratingB - ratingA;
                } else {
                  // Default sort by popularity (using a combination of rating and release date)
                  const ratingA = a.rating || 0;
                  const ratingB = b.rating || 0;

                  if (ratingB !== ratingA) {
                    return ratingB - ratingA;
                  }

                  // If ratings are equal, sort by release date (newer is better)
                  const dateA = a.released ? new Date(a.released) : new Date(0);
                  const dateB = b.released ? new Date(b.released) : new Date(0);
                  return dateB - dateA;
                }
              })
              .map((game) => (
                <div key={game.id} onClick={() => handleGameClick(game.id)}>
                  <GameCard game={game} />
                </div>
              ))
            }
          </div>
          {totalPages > 1 && (
            <div className="pagination">
              {/* Previous page button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="pagination-button pagination-nav"
              >
                &laquo; {t('pagination.previous')}
              </button>

              {(() => {
                const maxVisiblePages = 5; // Maximum number of page buttons to show (excluding ellipsis)
                const pages = [];

                console.log('Rendering pagination with totalPages:', totalPages, 'currentPage:', currentPage);

                // Don't render pagination if there's only one page
                if (totalPages <= 1) return [];

                // Force totalPages to be at least 2 if we're showing pagination
                const effectiveTotalPages = Math.max(totalPages, 2);

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
                let endPage = Math.min(effectiveTotalPages - 1, startPage + maxVisiblePages - 3);

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
                if (endPage < effectiveTotalPages - 1) {
                  pages.push(
                    <span key="ellipsis-end" className="pagination-ellipsis">...</span>
                  );
                }

                // Always show last page if there's more than one page
                pages.push(
                  <button
                    key={effectiveTotalPages}
                    disabled={effectiveTotalPages === currentPage}
                    onClick={() => handlePageChange(effectiveTotalPages)}
                    className={effectiveTotalPages === currentPage ? 'pagination-button active' : 'pagination-button'}
                  >
                    {effectiveTotalPages}
                  </button>
                );

                return pages;
              })()}

              {/* Next page button */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="pagination-button pagination-nav"
              >
                {t('pagination.next')} &raquo;
              </button>

              {/* Page info */}
              <div className="pagination-info">
                {t('pagination.page')} {currentPage} / {Math.max(totalPages, 2)}
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default JeuxIndex;
