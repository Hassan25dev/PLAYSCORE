import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Inertia } from '@inertiajs/inertia';
import { Head } from '@inertiajs/react';
import { fetchPlatforms, selectAllPlatforms, selectPlatformStatus } from '../../logiqueredux/platformsSlice';
import {
  fetchGames,
  selectAllGames,
  selectGameStatus,
  selectTotalCount,
  selectCurrentPage,
  setSelectedPlatforms
} from '../../logiqueredux/gamesSlice';
import GameCard from '../../components/GameCard/GameCard';
import MainLayout from '../../Layouts/MainLayout';
import { scrollToTop } from '../../utils/scrollUtils';
import { savePaginationState } from '../../utils/paginationStateUtils';
import { t } from '../../lang/translationHelper';
import '../../css/Home.css';
import '../platforms.css';
import haloImage from '../../images/halo-game-art-video-game-3840x2160-18784.jpg';

// Platform family icons
const PlatformIcons = {
  pc: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
      <path d="M5 0a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V1a1 1 0 0 0-1-1H5Zm.5 14V1.5h5v12.5h-5Z"/>
    </svg>
  ),
  console: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
      <path d="M11.5 6.027a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm-1.5 1.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1zm2.5-.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm-1.5 1.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1zm-6.5-3h1v1h1v1h-1v1h-1v-1h-1v-1h1v-1z"/>
      <path d="M3.051 3.26a.5.5 0 0 1 .354-.613l1.932-.518a.5.5 0 0 1 .62.39c.655-.079 1.35-.117 2.043-.117.72 0 1.443.041 2.12.126a.5.5 0 0 1 .622-.399l1.932.518a.5.5 0 0 1 .306.729c.14.09.266.19.373.297.408.408.78 1.05 1.095 1.772.32.733.599 1.591.805 2.466.206.875.34 1.78.364 2.606.024.816-.059 1.602-.328 2.21a1.42 1.42 0 0 1-1.445.83c-.636-.067-1.115-.394-1.513-.773-.245-.232-.496-.526-.739-.808-.126-.148-.25-.292-.368-.423-.728-.804-1.597-1.527-3.224-1.527-1.627 0-2.496.723-3.224 1.527-.119.131-.242.275-.368.423-.243.282-.494.575-.739.808-.398.38-.877.706-1.513.773a1.42 1.42 0 0 1-1.445-.83c-.27-.608-.352-1.395-.329-2.21.024-.826.16-1.73.365-2.606.206-.875.486-1.733.805-2.466.315-.722.687-1.364 1.094-1.772a2.34 2.34 0 0 1 .382-.302.5.5 0 0 1 .302-.73l1.932-.518a.5.5 0 0 1 .63.39zm1.23-1.057L3.372 2.5c-.068.015-.118.07-.134.137-.15.1-.314.24-.465.41-.35.39-.683.971-.97 1.638-.288.667-.546 1.447-.732 2.241-.185.794-.312 1.616-.332 2.346-.01.36.015.717.095 1.016.075.286.19.518.35.642.147.118.338.157.52.145.353-.037.655-.256.983-.566.172-.164.383-.41.621-.685.115-.135.262-.3.423-.477.61-.675 1.662-1.574 3.769-1.574 2.106 0 3.159.9 3.768 1.574.16.177.308.342.423.477.238.275.45.52.621.685.328.31.63.529.983.566.182.012.373-.027.52-.145.16-.124.275-.356.35-.642.08-.299.105-.656.095-1.016-.02-.73-.147-1.552-.332-2.346-.186-.794-.444-1.574-.732-2.241-.287-.667-.62-1.248-.97-1.639-.151-.17-.315-.31-.465-.41-.017-.067-.067-.122-.134-.137l-1.932-.518a.5.5 0 0 0-.197 0zM8 5.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
    </svg>
  ),
  mobile: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
      <path d="M11 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h6zM5 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H5z"/>
      <path d="M8 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
    </svg>
  ),
  other: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
      <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
    </svg>
  )
};

// Function to categorize platforms
const categorizePlatforms = (platforms) => {
  const categories = {
    pc: { name: t('platforms.categories.pc'), icon: PlatformIcons.pc, platforms: [] },
    playstation: { name: t('platforms.categories.playstation'), icon: PlatformIcons.console, platforms: [] },
    xbox: { name: t('platforms.categories.xbox'), icon: PlatformIcons.console, platforms: [] },
    nintendo: { name: t('platforms.categories.nintendo'), icon: PlatformIcons.console, platforms: [] },
    mobile: { name: t('platforms.categories.mobile'), icon: PlatformIcons.mobile, platforms: [] },
    other: { name: t('platforms.categories.other'), icon: PlatformIcons.other, platforms: [] }
  };

  platforms.forEach(platform => {
    const name = platform.name.toLowerCase();
    if (name.includes('pc') || name.includes('windows') || name.includes('linux') || name.includes('mac')) {
      categories.pc.platforms.push(platform);
    } else if (name.includes('playstation') || name.includes('ps')) {
      categories.playstation.platforms.push(platform);
    } else if (name.includes('xbox')) {
      categories.xbox.platforms.push(platform);
    } else if (name.includes('nintendo') || name.includes('switch') || name.includes('wii') || name.includes('3ds')) {
      categories.nintendo.platforms.push(platform);
    } else if (name.includes('ios') || name.includes('android')) {
      categories.mobile.platforms.push(platform);
    } else {
      categories.other.platforms.push(platform);
    }
  });

  // Filter out empty categories
  return Object.values(categories).filter(category => category.platforms.length > 0);
};

const PlatformsIndex = ({ auth }) => {
  const dispatch = useDispatch();
  const platforms = useSelector(selectAllPlatforms);
  const platformStatus = useSelector(selectPlatformStatus);
  const games = useSelector(selectAllGames);
  const gameStatus = useSelector(selectGameStatus);
  const totalCount = useSelector(selectTotalCount);
  const [loading, setLoading] = useState(false);
  const [selectedPlatforms, setLocalSelectedPlatforms] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFiltering, setIsFiltering] = useState(false);
  const [viewMode, setViewMode] = useState('grouped'); // 'grouped' or 'all'

  // Fetch platforms on component mount
  useEffect(() => {
    dispatch(fetchPlatforms());
  }, [dispatch]);

  // Fetch games when selected platforms change
  useEffect(() => {
    if (selectedPlatforms.length > 0) {
      setIsFiltering(true);
      dispatch(fetchGames({ platforms: selectedPlatforms.join(',') }));
    } else {
      setIsFiltering(false);
    }
  }, [dispatch, selectedPlatforms]);

  // Filter platforms based on search term
  const filteredPlatforms = useMemo(() => {
    if (!searchTerm.trim()) return platforms;
    return platforms.filter(platform =>
      platform.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [platforms, searchTerm]);

  // Categorize platforms for grouped view
  const platformCategories = useMemo(() => {
    return categorizePlatforms(filteredPlatforms);
  }, [filteredPlatforms]);

  // Get selected platform names for display
  const selectedPlatformNames = useMemo(() => {
    return selectedPlatforms.map(id => {
      const platform = platforms.find(p => p.id === id);
      return platform ? platform.name : '';
    }).filter(name => name !== '');
  }, [selectedPlatforms, platforms]);

  const handlePlatformClick = (platformId) => {
    setLocalSelectedPlatforms(prevSelected => {
      // If already selected, remove it
      if (prevSelected.includes(platformId)) {
        return prevSelected.filter(id => id !== platformId);
      }
      // Otherwise add it
      return [...prevSelected, platformId];
    });

    // Scroll to top of results when changing filters
    const resultsElement = document.querySelector('.filtered-games');
    if (resultsElement) {
      setTimeout(() => {
        resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  const handleRemovePlatform = (platformId) => {
    setLocalSelectedPlatforms(prevSelected =>
      prevSelected.filter(id => id !== platformId)
    );
  };

  const handleClearAllFilters = () => {
    setLocalSelectedPlatforms([]);
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
      source: 'platforms',
      filters: { platforms: selectedPlatforms.join(',') }
    });

    Inertia.visit(`/jeux/${id}`);
  };

  useEffect(() => {
    if (gameStatus !== 'loading') {
      setLoading(false);
    }
  }, [gameStatus]);

  if (platformStatus === 'loading') {
    return (
      <MainLayout auth={auth} currentUrl="/platforms">
        <div className="loading-container">
          <div className="spinner" />
          {t('common.loading')}
        </div>
      </MainLayout>
    );
  }

  if (loading) {
    return (
      <MainLayout auth={auth} currentUrl="/platforms">
        <div className="loading-overlay">
          <div className="spinner" />
          {t('common.loading')}
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout auth={auth} currentUrl="/platforms">
      <Head title={t('platforms.page_title')} />
      <div className="platforms-page">
        {/* Hero Section with Halo Image */}
        <section className="platforms-hero" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${haloImage})` }}>
          <div className="container">
            <h1 className="platforms-title">{t('platforms.hero_title')}</h1>
            <p className="platforms-subtitle">{t('platforms.hero_subtitle')}</p>
          </div>
        </section>

        <div className="platforms-container">
          <div className="platforms-list">
            <h2>{t('platforms.select_platforms')}</h2>

            <div className="filter-controls">
              <div className="filter-search">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                </svg>
                <input
                  type="text"
                  placeholder={t('platforms.search_placeholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="filter-actions">
                <button
                  className={`filter-action-btn ${viewMode === 'grouped' ? 'active' : ''}`}
                  onClick={() => setViewMode('grouped')}
                >
                  {t('platforms.view_grouped')}
                </button>
                <button
                  className={`filter-action-btn ${viewMode === 'all' ? 'active' : ''}`}
                  onClick={() => setViewMode('all')}
                >
                  {t('platforms.view_all')}
                </button>
                {selectedPlatforms.length > 0 && (
                  <button
                    className="filter-action-btn clear"
                    onClick={handleClearAllFilters}
                  >
                    {t('platforms.clear')}
                  </button>
                )}
              </div>
            </div>

            {viewMode === 'grouped' ? (
              <div className="platform-groups">
                {platformCategories.length === 0 ? (
                  <div className="no-results">{t('platforms.no_platforms_found')}</div>
                ) : (
                  platformCategories.map((category, index) => (
                    <div key={index} className="platform-group">
                      <div className="platform-group-title">
                        <span className="platform-icon">{category.icon}</span>
                        {category.name}
                      </div>
                      <div className="platform-group-content">
                        {category.platforms.map(platform => (
                          <div
                            key={platform.id}
                            className={`platform-tag ${selectedPlatforms.includes(platform.id) ? 'selected' : ''}`}
                            onClick={() => handlePlatformClick(platform.id)}
                          >
                            {platform.name}
                            {platform.game_count > 0 && (
                              <span className="platform-tag-count">{platform.game_count}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="platform-tags">
                {filteredPlatforms.length === 0 ? (
                  <div className="no-results">{t('platforms.no_platforms_found')}</div>
                ) : (
                  filteredPlatforms.map(platform => (
                    <div
                      key={platform.id}
                      className={`platform-tag ${selectedPlatforms.includes(platform.id) ? 'selected' : ''}`}
                      onClick={() => handlePlatformClick(platform.id)}
                    >
                      {platform.name}
                      {platform.game_count > 0 && (
                        <span className="platform-tag-count">{platform.game_count}</span>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <div className="filtered-games">
            <h2>
              {selectedPlatforms.length === 0
                ? t('platforms.select_to_see_games')
                : t('platforms.matching_games', { count: totalCount || games.length })}
            </h2>

            {selectedPlatforms.length > 0 && (
              <>
                <div className="selected-filters">
                  {selectedPlatformNames.map((name, index) => {
                    const platformId = selectedPlatforms[index];
                    return (
                      <div key={platformId} className="selected-filter">
                        <span>{name}</span>
                        <div
                          className="remove-filter"
                          onClick={() => handleRemovePlatform(platformId)}
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
                      {t('platforms.searching_games')}
                    </div>
                  ) : games.length === 0 ? (
                    <div className="no-results">
                      <div className="no-results-icon">🎮</div>
                      {t('platforms.no_matching_games')}
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

            {selectedPlatforms.length === 0 && (
              <div className="no-results">
                <div className="no-results-icon">🎮</div>
                {t('platforms.select_to_discover')}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PlatformsIndex;