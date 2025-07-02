import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { useTranslation } from '../../lang/translationHelper';
import Pagination from '@/components/Pagination';
import { Inertia } from '@inertiajs/inertia';

export default function Wishlist({ auth, wishlist, pagination }) {
    const { t } = useTranslation();
    const [sortBy, setSortBy] = useState('added_at');
    const [sortOrder, setSortOrder] = useState('desc');
    const [loading, setLoading] = useState(false);

    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
    };

    const sortedWishlist = [...wishlist].sort((a, b) => {
        if (sortBy === 'title') {
            return sortOrder === 'asc' 
                ? a.title.localeCompare(b.title) 
                : b.title.localeCompare(a.title);
        } else if (sortBy === 'rating') {
            return sortOrder === 'asc' 
                ? (a.rating || 0) - (b.rating || 0) 
                : (b.rating || 0) - (a.rating || 0);
        } else if (sortBy === 'added_at') {
            return sortOrder === 'asc' 
                ? new Date(a.added_at) - new Date(b.added_at) 
                : new Date(b.added_at) - new Date(a.added_at);
        }
        return 0;
    });

    const removeFromWishlist = (gameId) => {
        if (confirm(t('wishlist.confirm_remove') || 'Are you sure you want to remove this game from your wishlist?')) {
            setLoading(true);
            Inertia.delete(route('wishlist.destroy', gameId), {
                onSuccess: () => {
                    setLoading(false);
                },
                onError: () => {
                    setLoading(false);
                    alert(t('wishlist.error_removing') || 'There was an error removing the game from your wishlist.');
                }
            });
        }
    };

    const renderWishlistItem = (game) => (
        <div 
            key={game.id}
            className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 relative"
        >
            <Link href={route('jeux.show', game.id)}>
                <div className="relative h-40 overflow-hidden">
                    <img 
                        src={game.image || 'https://via.placeholder.com/300x200?text=No+Image'} 
                        alt={game.title} 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    {game.rating && (
                        <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center">
                            {game.rating.toFixed(1)}
                        </div>
                    )}
                </div>
            </Link>
            <div className="p-4">
                <Link 
                    href={route('jeux.show', game.id)}
                    className="font-semibold text-gray-800 hover:text-pink-600 transition-colors duration-300"
                >
                    {game.title}
                </Link>
                
                <div className="mt-2 flex flex-wrap gap-1">
                    {game.genres && game.genres.slice(0, 2).map(genre => (
                        <span 
                            key={genre.id} 
                            className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full"
                        >
                            {genre.name}
                        </span>
                    ))}
                </div>
                
                <div className="mt-3 flex justify-between items-center">
                    <span className="text-xs text-gray-500">{t('wishlist.added', { date: game.added_at }) || `Added ${game.added_at}`}</span>
                    <button
                        onClick={() => removeFromWishlist(game.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                        disabled={loading}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <MainLayout auth={auth} currentUrl="/wishlist">
            <Head title={t('wishlist.page_title') || 'My Wishlist'} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-2 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                    {t('wishlist.page_title') || 'My Wishlist'}
                                </h2>
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center">
                                        <label htmlFor="sort" className="mr-2 text-sm text-gray-600">{t('wishlist.sort_by') || 'Sort by'}:</label>
                                        <select
                                            id="sort"
                                            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm"
                                            value={sortBy}
                                            onChange={(e) => handleSort(e.target.value)}
                                        >
                                            <option value="added_at">{t('wishlist.sort_date_added') || 'Date Added'}</option>
                                            <option value="title">{t('wishlist.sort_title') || 'Title'}</option>
                                            <option value="rating">{t('wishlist.sort_rating') || 'Rating'}</option>
                                        </select>
                                    </div>
                                    <button
                                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                        className="p-1 rounded-md hover:bg-gray-100 transition-colors"
                                    >
                                        {sortOrder === 'asc' ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {wishlist.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                    <p className="text-gray-500 mb-4">{t('wishlist.wishlist.empty') || 'Your wishlist is empty.'}</p>
                                    <Link
                                        href={route('jeux.index')}
                                        className="inline-flex items-center px-4 py-2 bg-pink-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-pink-700 active:bg-pink-800 focus:outline-none focus:border-pink-800 focus:ring ring-pink-300 disabled:opacity-25 transition"
                                    >
                                        {t('dashboard.browse_games') || 'Browse Games'}
                                    </Link>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                        {sortedWishlist.map(game => renderWishlistItem(game))}
                                    </div>
                                    
                                    <div className="mt-8">
                                        <Pagination links={pagination} />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}