import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Head, router } from '@inertiajs/react';
import { fetchPlatforms, selectAllPlatforms, selectPlatformStatus } from '../logiqueredux/platformsSlice';
import {
  fetchGames,
  selectAllGames,
  selectGameStatus,
  setSelectedPlatforms,
  selectSelectedPlatforms
} from '../logiqueredux/gamesSlice';
import GameCard from '../components/GameCard/GameCard';
import MainLayout from '../Layouts/MainLayout';
import '../css/Home.css';
import './platforms.css';
import halo from '../images/halo-battlefield-3840x2160-18793.jpg';

const Platforms = ({ auth }) => {
  const dispatch = useDispatch();
  const platforms = useSelector(selectAllPlatforms);
  const platformStatus = useSelector(selectPlatformStatus);
  const games = useSelector(selectAllGames);
  const gameStatus = useSelector(selectGameStatus);
  const [loading, setLoading] = useState(false);
  // Use Redux state for selected platforms
  const reduxSelectedPlatforms = useSelector(selectSelectedPlatforms);

  // Fetch platforms on component mount
  useEffect(() => {
    dispatch(fetchPlatforms());
  }, [dispatch]);

  // Fetch games when reduxSelected platforms change
  useEffect(() => {
    // Only fetch games if there are selected platforms
    if (reduxSelectedPlatforms.length === 0) {
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
      console.log('Dispatching fetchGames with platforms:', reduxSelectedPlatforms.join(','));
      dispatch(fetchGames({
        platforms: reduxSelectedPlatforms.join(',')
      }))
        .unwrap()
        .then(data => {
          console.log('Games fetched successfully:', data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching games by platform:', error);
          setLoading(false);
        });
    } catch (error) {
      console.error('Exception in fetchGames dispatch:', error);
      setLoading(false);
    }

    return () => {
      clearTimeout(loadingTimeout);
    };
  }, [dispatch, reduxSelectedPlatforms]);

  const handlePlatformClick = (platformId) => {
    // Update Redux state instead of local state
  dispatch(setSelectedPlatforms(
    reduxSelectedPlatforms.includes(platformId)
      ? reduxSelectedPlatforms.filter(id => id !== platformId)
      : [...reduxSelectedPlatforms, platformId]
  ));
  };

  const handleGameClick = (id) => {
    setLoading(true);
    router.visit(`/jeux/${id}`);
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
          Chargement des plateformes...
        </div>
      </MainLayout>
    );
  }

  if (loading) {
    return (
      <MainLayout auth={auth} currentUrl="/platforms">
        <div className="loading-overlay">
          <div className="spinner" />
          Chargement des détails du jeu...
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout auth={auth} currentUrl="/platforms">
      <Head title="Plateformes de Jeux | PlayScore" />
      <div className="platforms-page">
        {/* Hero Section */}
        <section className="platforms-hero" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${halo})` }}>
          <div className="container">
            <h1 className="platforms-title">Plateformes de Jeux</h1>
            <p className="platforms-subtitle">Découvrez les jeux par plateforme et trouvez votre prochaine aventure</p>
          </div>
        </section>

        <div className="platforms-container">
        <div className="platforms-list">
          <h2>Sélectionnez des plateformes</h2>
          <div className="platform-tags">
            {platforms.map(platform => (
              <div
                key={platform.id}
                className={`platform-tag ${reduxSelectedPlatforms.includes(platform.id) ? 'selected' : ''}`}
                onClick={() => handlePlatformClick(platform.id)}
              >
                {platform.name}
              </div>
            ))}
          </div>
        </div>

        <div className="filtered-games">
          <h2>
            {reduxSelectedPlatforms.length === 0
              ? 'Sélectionnez des plateformes pour voir les jeux'
              : `Jeux correspondants (${games.length})`}
          </h2>

          {reduxSelectedPlatforms.length > 0 && (
            <div className="game-list">
              {games.length === 0 ? (
                <div className="no-results">Aucun jeu ne correspond à ces plateformes.</div>
              ) : (
                games.map((game) => (
                  <div key={game.id} onClick={() => handleGameClick(game.id)}>
                    <GameCard game={game} />
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
      </div>
    </MainLayout>
  );
};

export default Platforms;