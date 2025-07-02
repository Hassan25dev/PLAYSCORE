import React from 'react';
import { Link } from '@inertiajs/react';
import { useTranslation } from '../../lang/translationHelper';

export default function GameListComponent({ 
    title, 
    games, 
    icon, 
    loading = false, 
    emptyMessage, 
    viewAllLink, 
    viewAllText,
    iconColor = 'text-indigo-600',
    viewAllLinkColor = 'text-indigo-600 hover:text-indigo-800'
}) {
    const { t } = useTranslation();

    const renderGameCard = (game) => (
        <Link 
            href={route('jeux.show', game.id)} 
            key={game.id}
            className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
        >
            <div className="relative h-40 overflow-hidden">
                <img 
                    src={game.image || 'https://via.placeholder.com/300x200?text=No+Image'} 
                    alt={game.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center">
                    {game.rating ? game.rating.toFixed(1) : '?'}
                </div>
            </div>
            <div className="p-4">
                <h3 className="font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors duration-300">{game.title}</h3>
            </div>
        </Link>
    );

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                        {icon && (
                            <span className={`mr-2 ${iconColor}`}>
                                {icon}
                            </span>
                        )}
                        {title}
                    </h3>
                    {viewAllLink && (
                        <Link href={viewAllLink} className={`text-sm ${viewAllLinkColor} transition-colors`}>
                            {viewAllText || t('dashboard.view_all') || 'View All'} →
                        </Link>
                    )}
                </div>
                
                {loading ? (
                    <div className="flex justify-center items-center h-40">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                    </div>
                ) : games && games.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {games.map(game => renderGameCard(game))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                        </svg>
                        <p className="text-gray-500 mb-4">{emptyMessage || t('dashboard.no_games') || 'No games found.'}</p>
                        <Link
                            href={route('jeux.index')}
                            className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 active:bg-indigo-800 focus:outline-none focus:border-indigo-800 focus:ring ring-indigo-300 disabled:opacity-25 transition"
                        >
                            {t('dashboard.browse_games') || 'Browse Games'}
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
