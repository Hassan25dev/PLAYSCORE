import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

const GameCatalog = () => {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        genre: '',
        platform: '',
        releaseDate: ''
    });
    const [genres, setGenres] = useState([]);
    const [platforms, setPlatforms] = useState([]);
    const [language, setLanguage] = useState('fr');

    // Fetch games with filters
    useEffect(() => {
        const fetchGames = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/api/games', { params: filters });
                setGames(response.data);
            } catch (error) {
                console.error('Error fetching games:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchGames();
    }, [filters]);

    // Fetch genres and platforms for filters
    useEffect(() => {
        const fetchFiltersData = async () => {
            try {
                const [genresResponse, platformsResponse] = await Promise.all([
                    axios.get('/api/genres'),
                    axios.get('/api/platforms')
                ]);
                setGenres(genresResponse.data);
                setPlatforms(platformsResponse.data);
            } catch (error) {
                console.error('Error fetching filter data:', error);
            }
        };

        fetchFiltersData();
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const exportToPdf = async (gameId) => {
        try {
            window.open(`/api/games/${gameId}/pdf`, '_blank');
        } catch (error) {
            console.error('Error exporting to PDF:', error);
        }
    };

    return (
        <div className="game-catalog">
            <div className="language-selector mb-4">
                <button 
                    className={`btn ${language === 'fr' ? 'btn-primary' : 'btn-outline-primary'} me-2`}
                    onClick={() => setLanguage('fr')}
                >
                    Français
                </button>
                <button 
                    className={`btn ${language === 'en' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setLanguage('en')}
                >
                    English
                </button>
            </div>

            <div className="filters mb-4">
                <h3>{language === 'fr' ? 'Filtres' : 'Filters'}</h3>
                <div className="row">
                    <div className="col-md-4">
                        <select 
                            name="genre" 
                            className="form-select" 
                            value={filters.genre}
                            onChange={handleFilterChange}
                        >
                            <option value="">{language === 'fr' ? 'Tous les genres' : 'All genres'}</option>
                            {genres.map(genre => (
                                <option key={genre.id} value={genre.id}>{genre.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-4">
                        <select 
                            name="platform" 
                            className="form-select" 
                            value={filters.platform}
                            onChange={handleFilterChange}
                        >
                            <option value="">{language === 'fr' ? 'Toutes les plateformes' : 'All platforms'}</option>
                            {platforms.map(platform => (
                                <option key={platform.id} value={platform.id}>{platform.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-4">
                        <input 
                            type="date" 
                            name="releaseDate" 
                            className="form-control" 
                            value={filters.releaseDate}
                            onChange={handleFilterChange}
                            placeholder={language === 'fr' ? 'Date de sortie' : 'Release date'}
                        />
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : games.length > 0 ? (
                <div className="row">
                    {games.map(game => (
                        <div key={game.id} className="col-md-4 mb-4">
                            <div className="card h-100">
                                {game.image_url && (
                                    <img src={game.image_url} className="card-img-top" alt={game.title} />
                                )}
                                <div className="card-body">
                                    <h5 className="card-title">{game.title}</h5>
                                    <p className="card-text">{game.description}</p>
                                    <div className="d-flex align-items-center mb-2">
                                        <div className="me-2">
                                            <span className="badge bg-primary">
                                                {game.average_rating ? game.average_rating.toFixed(1) : 'N/A'} ★
                                            </span>
                                        </div>
                                        <div>
                                            ({game.ratings_count} {language === 'fr' ? 'évaluations' : 'ratings'})
                                        </div>
                                    </div>
                                    <div className="mb-2">
                                        {game.genres && game.genres.map(genre => (
                                            <span key={genre.id} className="badge bg-secondary me-1">{genre.name}</span>
                                        ))}
                                    </div>
                                    <div className="mb-3">
                                        {game.platforms && game.platforms.map(platform => (
                                            <span key={platform.id} className="badge bg-info me-1">{platform.name}</span>
                                        ))}
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <a href={`/games/${game.id}`} className="btn btn-primary">
                                            {language === 'fr' ? 'Voir détails' : 'View details'}
                                        </a>
                                        <button 
                                            onClick={() => exportToPdf(game.id)} 
                                            className="btn btn-outline-secondary"
                                        >
                                            <i className="fas fa-file-pdf"></i> PDF
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="alert alert-info">
                    {language === 'fr' ? 'Aucun jeu disponible.' : 'No games available.'}
                </div>
            )}
        </div>
    );
};

if (document.getElementById('game-catalog-root')) {
    ReactDOM.render(<GameCatalog />, document.getElementById('game-catalog-root'));
}

export default GameCatalog;