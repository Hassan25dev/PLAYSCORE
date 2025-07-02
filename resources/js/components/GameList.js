import React, { useEffect, useState } from 'react';
import axios from 'axios';

const GameList = () => {
    const [games, setGames] = useState([]);

    useEffect(() => {
        fetchGames();
    }, []);

    const fetchGames = async () => {
        try {
            const response = await axios.get('/api/games');
            setGames(response.data);
        } catch (error) {
            console.error('Error fetching games:', error);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Game List</h1>
            <ul className="space-y-4">
                {games.map((game) => (
                    <li key={game.id} className="bg-white p-4 rounded shadow">
                        <h2 className="text-xl font-semibold">{game.title}</h2>
                        <p className="text-gray-600">{game.description}</p>
                        <p className="text-sm text-gray-500">
                            Released on {new Date(game.release_date).toLocaleDateString()}
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default GameList;