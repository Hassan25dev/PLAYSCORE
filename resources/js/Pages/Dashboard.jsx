import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { useTranslation } from '../lang/translationHelper';
import WishlistComponent from '../components/User/WishlistComponent';
import RatingHistoryComponent from '../components/User/RatingHistoryComponent';
import UserStatsComponent from '../components/User/UserStatsComponent';
import RatingsDistributionChart from '../components/Charts/RatingsDistributionChart';
import UserActivityChart from '../components/Charts/UserActivityChart';
import PdfGenerationComponent from '../components/PdfGenerationComponent';
import { Tab } from '@headlessui/react';

export default function Dashboard({ auth, wishlist, ratings, recommendedGames, recentGames, stats }) {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState(0);
    const [loading, setLoading] = useState(false);

    // Prepare ratings distribution data for the chart
    const ratingsDistribution = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0
    };

    // Count ratings by score
    ratings.forEach(rating => {
        const score = Math.round(rating.rating);
        if (score >= 1 && score <= 5) {
            ratingsDistribution[score]++;
        }
    });

    const renderGameCard = (game) => (
        <Link
            href={route('jeux.show', game.id)}
            key={game.id}
            className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
        >
            <div className="relative h-40 overflow-hidden">
                <img
                    src={game.image}
                    alt={game.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    decoding="async"
                />
                <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center">
                    {game.rating}
                </div>
            </div>
            <div className="p-4">
                <h3 className="font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors duration-300">{game.title}</h3>
            </div>
        </Link>
    );

    return (
        <MainLayout auth={auth} currentUrl="/dashboard">
            <Head title={t('dashboard.title') || 'Dashboard'} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <h2 className="font-semibold text-2xl text-gray-800 leading-tight mb-4">
                        {t('dashboard.welcome', { name: auth.user.name }) || `Welcome, ${auth.user.name}!`}
                    </h2>

                    {/* Welcome message for new users */}
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100 mb-6">
                        <div className="flex flex-col md:flex-row items-start md:items-center">
                            <div className="flex-shrink-0 bg-indigo-100 rounded-full p-3 mr-4 mb-4 md:mb-0">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-gray-800 mb-2">{t('dashboard.getting_started') || 'Getting Started with PlayScore'}</h3>
                                <p className="text-gray-600 mb-4">{t('dashboard.welcome_message') || 'Welcome to your personal dashboard! Here you can track your gaming activity, manage your wishlist, and see your rating history. Start by browsing games, adding them to your wishlist, or rating games you\'ve played.'}</p>
                                <div className="flex flex-wrap gap-2">
                                    <Link
                                        href={route('jeux.index')}
                                        className="inline-flex items-center px-3 py-2 bg-indigo-600 border border-transparent rounded-md text-xs text-white uppercase tracking-widest hover:bg-indigo-700 active:bg-indigo-800 focus:outline-none focus:ring ring-indigo-300 disabled:opacity-25 transition"
                                    >
                                        {t('dashboard.browse_games') || 'Browse Games'}
                                    </Link>
                                    <Link
                                        href="/help/user-guide"
                                        className="inline-flex items-center px-3 py-2 bg-white border border-gray-300 rounded-md text-xs text-gray-700 uppercase tracking-widest hover:bg-gray-50 active:bg-gray-100 focus:outline-none focus:ring ring-indigo-300 disabled:opacity-25 transition"
                                    >
                                        {t('dashboard.learn_more') || 'Learn More'}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* User Stats */}
                    <UserStatsComponent stats={stats} />

                    {/* Tabbed Interface */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
                        <div className="p-6">
                            <Tab.Group selectedIndex={activeTab} onChange={setActiveTab}>
                                <Tab.List className="flex space-x-1 rounded-xl bg-gray-100 p-1">
                                    <Tab
                                        className={({ selected }) =>
                                            `w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all duration-300
                                            ${selected
                                                ? 'bg-white shadow text-indigo-600'
                                                : 'text-gray-600 hover:bg-white/[0.12] hover:text-indigo-500'
                                            }`
                                        }
                                    >
                                        <div className="flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                            </svg>
                                            {t('dashboard.overview') || 'Overview'}
                                        </div>
                                    </Tab>
                                    <Tab
                                        className={({ selected }) =>
                                            `w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all duration-300
                                            ${selected
                                                ? 'bg-white shadow text-pink-600'
                                                : 'text-gray-600 hover:bg-white/[0.12] hover:text-pink-500'
                                            }`
                                        }
                                    >
                                        <div className="flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                            </svg>
                                            {t('dashboard.wishlist') || 'Wishlist'}
                                        </div>
                                    </Tab>
                                    <Tab
                                        className={({ selected }) =>
                                            `w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all duration-300
                                            ${selected
                                                ? 'bg-white shadow text-yellow-600'
                                                : 'text-gray-600 hover:bg-white/[0.12] hover:text-yellow-500'
                                            }`
                                        }
                                    >
                                        <div className="flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                            </svg>
                                            {t('dashboard.ratings') || 'Ratings'}
                                        </div>
                                    </Tab>
                                    <Tab
                                        className={({ selected }) =>
                                            `w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all duration-300
                                            ${selected
                                                ? 'bg-white shadow text-green-600'
                                                : 'text-gray-600 hover:bg-white/[0.12] hover:text-green-500'
                                            }`
                                        }
                                    >
                                        <div className="flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                            </svg>
                                            {t('dashboard.stats') || 'Stats'}
                                        </div>
                                    </Tab>
                                </Tab.List>
                                <Tab.Panels className="mt-6">
                                    {/* Overview Panel */}
                                    <Tab.Panel>
                                        {/* Quick Actions */}
                                        <div className="mb-8">
                                            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                </svg>
                                                {t('dashboard.quick_actions') || 'Quick Actions'}
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                <Link
                                                    href={route('jeux.index')}
                                                    className="flex flex-col p-5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 border border-blue-200 group"
                                                >
                                                    <div className="flex items-center mb-4">
                                                        <div className="p-3 mr-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg text-white shadow-md group-hover:shadow-lg transition-all duration-300">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                                                            </svg>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-700">{t('dashboard.browse_games') || 'Browse Games'}</p>
                                                        </div>
                                                    </div>
                                                    <span className="text-blue-600 group-hover:text-blue-800 transition-colors self-end">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                                        </svg>
                                                    </span>
                                                </Link>

                                                <Link
                                                    href={route('profile.edit')}
                                                    className="flex flex-col p-5 bg-gradient-to-br from-green-50 to-green-100 rounded-xl hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 border border-green-200 group"
                                                >
                                                    <div className="flex items-center mb-4">
                                                        <div className="p-3 mr-4 bg-gradient-to-br from-green-500 to-green-600 rounded-lg text-white shadow-md group-hover:shadow-lg transition-all duration-300">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                            </svg>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-700">{t('dashboard.edit_profile') || 'Edit Profile'}</p>
                                                        </div>
                                                    </div>
                                                    <span className="text-green-600 group-hover:text-green-800 transition-colors self-end">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                                        </svg>
                                                    </span>
                                                </Link>

                                                <Link
                                                    href={route('notifications.all')}
                                                    className="flex flex-col p-5 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 border border-purple-200 group"
                                                >
                                                    <div className="flex items-center mb-4">
                                                        <div className="p-3 mr-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg text-white shadow-md group-hover:shadow-lg transition-all duration-300">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                                            </svg>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-700">{t('dashboard.notifications') || 'Notifications'}</p>
                                                        </div>
                                                    </div>
                                                    <span className="text-purple-600 group-hover:text-purple-800 transition-colors self-end">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                                        </svg>
                                                    </span>
                                                </Link>
                                            </div>
                                        </div>

                                        {/* Recently Played Games */}
                                        <div className="mb-8">
                                            <div className="flex justify-between items-center mb-6">
                                                <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    {t('dashboard.recently_played') || 'Recently Played'}
                                                </h3>
                                                <Link href={route('jeux.index')} className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors">
                                                    {t('dashboard.view_all') || 'View All'} →
                                                </Link>
                                            </div>

                                            {loading ? (
                                                <div className="flex justify-center items-center h-40">
                                                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                                                </div>
                                            ) : recentGames.length > 0 ? (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                                                    {recentGames.map(game => renderGameCard(game))}
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center py-12 text-center bg-gray-50 rounded-xl border border-gray-100">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <h3 className="text-lg font-medium text-gray-700 mb-2">{t('dashboard.no_recent_games') || 'No Recent Activity'}</h3>
                                                    <p className="text-gray-500 mb-6 max-w-md">{t('dashboard.start_playing') || 'Start playing games to see your recent activity here.'}</p>
                                                    <Link
                                                        href={route('jeux.index')}
                                                        className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 active:bg-indigo-800 focus:outline-none focus:border-indigo-800 focus:ring ring-indigo-300 disabled:opacity-25 transition"
                                                    >
                                                        {t('dashboard.browse_games') || 'Browse Games'} →
                                                    </Link>
                                                </div>
                                            )}
                                        </div>

                                        {/* Recommended Games */}
                                        <div>
                                            <div className="flex justify-between items-center mb-6">
                                                <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                                    </svg>
                                                    {t('dashboard.recommended') || 'Recommended For You'}
                                                </h3>
                                                <Link href={route('jeux.index')} className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors">
                                                    {t('dashboard.discover_more') || 'Discover More'} →
                                                </Link>
                                            </div>

                                            {loading ? (
                                                <div className="flex justify-center items-center h-40">
                                                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                                                    {recommendedGames.map(game => renderGameCard(game))}
                                                </div>
                                            )}
                                        </div>
                                    </Tab.Panel>

                                    {/* Wishlist Panel */}
                                    <Tab.Panel>
                                        <WishlistComponent wishlist={wishlist} />

                                        <div className="mt-6 text-center">
                                            <Link
                                                href={route('wishlist.index')}
                                                className="inline-flex items-center px-4 py-2 bg-pink-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-pink-700 active:bg-pink-800 focus:outline-none focus:border-pink-800 focus:ring ring-pink-300 disabled:opacity-25 transition"
                                            >
                                                {t('wishlist.actions.view_all') || 'View All Wishlist Items'} →
                                            </Link>
                                        </div>
                                    </Tab.Panel>

                                    {/* Ratings Panel */}
                                    <Tab.Panel>
                                        <RatingHistoryComponent ratings={ratings} />

                                        <div className="mt-6 text-center">
                                            <Link
                                                href={route('ratings.index')}
                                                className="inline-flex items-center px-4 py-2 bg-yellow-500 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-yellow-600 active:bg-yellow-700 focus:outline-none focus:border-yellow-700 focus:ring ring-yellow-300 disabled:opacity-25 transition"
                                            >
                                                {t('dashboard.view_all_ratings') || 'View All Ratings'} →
                                            </Link>
                                        </div>
                                    </Tab.Panel>

                                    {/* Stats Panel */}
                                    <Tab.Panel>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                                    {t('dashboard.rating_distribution') || 'Rating Distribution'}
                                                </h3>
                                                <RatingsDistributionChart ratings={ratingsDistribution} />
                                            </div>

                                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                                    {t('dashboard.activity_summary') || 'Activity Summary'}
                                                </h3>
                                                <div className="space-y-4">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-gray-600">{t('dashboard.total_games_played') || 'Total Games Played'}</span>
                                                        <span className="font-semibold text-gray-800">{stats.gamesPlayed}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-gray-600">{t('dashboard.reviews_written') || 'Reviews Written'}</span>
                                                        <span className="font-semibold text-gray-800">{stats.reviewsWritten}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-gray-600">{t('dashboard.wishlisted_games') || 'Wishlisted Games'}</span>
                                                        <span className="font-semibold text-gray-800">{stats.wishlistedGames}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-gray-600">{t('dashboard.average_rating') || 'Average Rating'}</span>
                                                        <span className="font-semibold text-gray-800">
                                                            {ratings.length > 0
                                                                ? (ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length).toFixed(1)
                                                                : '-'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* User Activity Chart or Getting Started Message */}
                                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                                {t('dashboard.activity_over_time') || 'Activity Over Time'}
                                            </h3>

                                            {stats.gamesPlayed > 0 ? (
                                                <UserActivityChart
                                                    showTimeFilter={true}
                                                    onPeriodChange={(period) => {
                                                        console.log(`Period changed to: ${period}`);
                                                        // This is just for logging, the component will handle the data fetching
                                                    }}
                                                />
                                            ) : (
                                                <div className="flex flex-col items-center justify-center py-8 text-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                                    </svg>
                                                    <h3 className="text-lg font-medium text-gray-700 mb-2">{t('dashboard.no_activity_yet') || 'No Activity Yet'}</h3>
                                                    <p className="text-gray-500 mb-4 max-w-md">{t('dashboard.activity_explanation') || 'Your activity chart will show your gaming trends over time as you rate and play games.'}</p>
                                                    <Link
                                                        href={route('jeux.index')}
                                                        className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 active:bg-indigo-800 focus:outline-none focus:border-indigo-800 focus:ring ring-indigo-300 disabled:opacity-25 transition"
                                                    >
                                                        {t('dashboard.start_exploring') || 'Start Exploring'} →
                                                    </Link>
                                                </div>
                                            )}
                                        </div>

                                        {/* PDF Generation Component */}
                                        <div className="mt-6">
                                            <PdfGenerationComponent
                                                userRole="user"
                                                auth={auth}
                                                stats={stats}
                                                ratings={ratings}
                                                wishlist={wishlist}
                                            />
                                        </div>

                                        {/* Notification Information */}
                                        <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                                </svg>
                                                Notifications
                                            </h3>
                                            <p className="text-gray-600 mb-4">
                                                Check the notification bell icon in the header to see your notifications. You'll receive notifications about game approvals, comments, and other important updates.
                                            </p>
                                            <div className="flex justify-center">
                                                <Link
                                                    href={route('notifications.all')}
                                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                                                >
                                                    View All Notifications
                                                </Link>
                                            </div>
                                        </div>
                                    </Tab.Panel>
                                </Tab.Panels>
                            </Tab.Group>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
