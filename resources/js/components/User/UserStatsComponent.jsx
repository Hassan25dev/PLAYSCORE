import React from 'react';
import { Link } from '@inertiajs/react';
import { useTranslation } from '../../lang/translationHelper';

export default function UserStatsComponent({ stats }) {
    const { t } = useTranslation();
    const isNewUser = stats.gamesPlayed === 0 && stats.reviewsWritten === 0 && stats.wishlistedGames === 0;

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-md overflow-hidden">
                    <div className="p-6 text-white">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-white bg-opacity-20 mr-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-white text-opacity-80 text-sm">{t('dashboard.games_played') || 'Games Played'}</p>
                                <p className="text-3xl font-bold">{stats.gamesPlayed}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-md overflow-hidden">
                    <div className="p-6 text-white">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-white bg-opacity-20 mr-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-white text-opacity-80 text-sm">{t('dashboard.reviews_written') || 'Reviews Written'}</p>
                                <p className="text-3xl font-bold">{stats.reviewsWritten}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl shadow-md overflow-hidden">
                    <div className="p-6 text-white">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-white bg-opacity-20 mr-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-white text-opacity-80 text-sm">{t('dashboard.wishlisted_games') || 'Wishlisted Games'}</p>
                                <p className="text-3xl font-bold">{stats.wishlistedGames}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {isNewUser && (
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-8">
                    <div className="flex items-start">
                        <div className="flex-shrink-0 bg-blue-100 rounded-full p-2 mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <h4 className="text-sm font-medium text-blue-800">{t('dashboard.stats_tip_title') || 'Track Your Gaming Journey'}</h4>
                            <p className="text-sm text-blue-600 mt-1">{t('dashboard.stats_tip_description') || 'Your stats will update as you interact with games. Start by browsing games, adding them to your wishlist, or rating games you\'ve played.'}</p>
                            <div className="mt-2">
                                <Link
                                    href={route('jeux.index')}
                                    className="text-sm font-medium text-blue-700 hover:text-blue-900"
                                >
                                    {t('dashboard.explore_games') || 'Explore Games'} →
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
