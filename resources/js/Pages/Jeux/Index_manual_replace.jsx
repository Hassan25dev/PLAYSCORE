import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import GameCard from '../../components/GameCard/GameCard';
import '../../css/Home.css';
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

const JeuxIndex = () => {
  const dispatch = useDispatch();
  const games = useSelector(selectAllGames);
  const status = useSelector(selectGameStatus);
  const error = useSelector(selectGameError);
  const currentPage = useSelector(selectCurrentPage);
  const totalPages = useSelector(selectTotalPages);
  const searchQuery = useSelector(selectSearchQuery);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchGames({ page: currentPage, search: searchQuery }));
  }, [dispatch, currentPage, searchQuery]);

  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page));
  };

  const handleSearchChange = (e) => {
    dispatch(setSearchQuery(e.target.value));
  };

  const handleGameClick = (id) => {
    setLoading(true);
  };

  useEffect(() => {
    if (status !== 'loading') {
      setLoading(false);
    }
  }, [status]);

  if (status === 'failed') {
    return <div className="error">Erreur: {error}</div>;
  }

  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="spinner" />
        Chargement des détails du jeu...
      </div>
    );
  }

  if (!games || games.length === 0) {
    return <div className="no-results">Aucun jeu trouvé.</div>;
  }

  return (
    <div className="home">
      <h1>Liste des Jeux</h1>
      <input
        type="text"
        placeholder="Rechercher un jeu..."
        value={searchQuery}
        onChange={handleSearchChange}
      />
      <div className="game-list">
        {games.map((game) => (
          <div key={game.id} onClick={() => handleGameClick(game.id)}>
            <GameCard game={game} />
          </div>
        ))}
      </div>
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            disabled={page === currentPage}
            onClick={() => handlePageChange(page)}
            className={page === currentPage ? 'pagination-button active' : 'pagination-button'}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
};

export default JeuxIndex;
