import React from 'react';
import { Link } from '@inertiajs/react';
import { useTranslation } from '../../lang/translationHelper';

export default function WishlistComponent({ wishlist }) {
    const { t } = useTranslation();

    if (!wishlist || wishlist.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            {t('wishlist.wishlist.title') || 'My Wishlist'}
                        </h3>
                        <Link href={route('jeux.index')} className="text-sm text-pink-600 hover:text-pink-800 transition-colors">
                            {t('wishlist.actions.view_all') || 'View All'} →
                        </Link>
                    </div>

                    <div className="flex flex-col items-center justify-center py-12 text-center bg-gray-50 rounded-xl border border-gray-100">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-700 mb-2">{t('wishlist.wishlist.empty_title') || 'Start Building Your Wishlist'}</h3>
                        <p className="text-gray-500 mb-6 max-w-md">{t('wishlist.wishlist.empty_description') || 'Save games you\'re interested in to your wishlist. You can easily find them later and get notified about updates or sales.'}</p>
                        <div className="space-y-4">
                            <Link
                                href={route('jeux.index')}
                                className="inline-flex items-center px-4 py-2 bg-pink-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-pink-700 active:bg-pink-800 focus:outline-none focus:border-pink-800 focus:ring ring-pink-300 disabled:opacity-25 transition"
                            >
                                {t('dashboard.browse_games') || 'Browse Games'}
                            </Link>
                            <div className="text-sm text-gray-500 mt-4">
                                <p>{t('wishlist.wishlist.how_to_add') || 'To add a game to your wishlist, click the heart icon on any game page.'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const renderWishlistItem = (game) => (
        <Link
            href={route('jeux.show', game.id)}
            key={game.id}
            className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
        >
            <div className="relative h-40 overflow-hidden">
                <img
                    src={game.image || 'https://via.placeholder.com/300x200?text=No+Image'}
                    alt={game.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    decoding="async"
                />
                <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center">
                    {game.rating ? game.rating.toFixed(1) : '?'}
                </div>
            </div>
            <div className="p-4">
                <h3 className="font-semibold text-gray-800 group-hover:text-pink-600 transition-colors duration-300">{game.title}</h3>
                <p className="text-xs text-gray-500 mt-1">{t('wishlist.added', { date: game.added_at }) || `Added ${game.added_at}`}</p>
            </div>
        </Link>
    );

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        {t('wishlist.wishlist.title') || 'My Wishlist'}
                    </h3>

                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {wishlist.map(game => renderWishlistItem(game))}
                </div>
            </div>
        </div>
    );
}
