import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';
import { useTranslation } from '../../lang/translationHelper';
import QuickActions from '../../Components/Developer/QuickActions';
import GameSubmissionStatus from '../../Components/Developer/GameSubmissionStatus';
import EnhancedActivityFeed from '../../Components/Developer/EnhancedActivityFeed';
import DashboardStatsChart from '../../Components/Charts/DashboardStatsChart';
import PdfGenerationComponent from '../../components/PdfGenerationComponent';
import XmlImportExportComponent from '../../components/XmlImportExportComponent';
export default function DeveloperDashboard({ auth, stats, recentActivity }) {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('overview');

    return (
        <MainLayout auth={auth} currentUrl="/developer/dashboard">
            <Head title={t('developer.title')} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                        <h2 className="font-semibold text-2xl text-gray-800 leading-tight">
                            {t('developer.title')}
                        </h2>
                        <div className="mt-4 md:mt-0 flex space-x-2">
                            <button
                                onClick={() => setActiveTab('overview')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                                    activeTab === 'overview'
                                        ? 'bg-teal-600 text-white shadow-md'
                                        : 'bg-white text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                {t('developer.overview_tab')}
                            </button>
                            <button
                                onClick={() => setActiveTab('activity')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                                    activeTab === 'activity'
                                        ? 'bg-teal-600 text-white shadow-md'
                                        : 'bg-white text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                {t('developer.activity_tab')}
                            </button>
                        </div>
                    </div>

                    {/* Welcome Card */}
                    <div className="bg-gradient-to-r from-teal-600 to-blue-600 rounded-xl shadow-lg mb-8 overflow-hidden">
                        <div className="p-8 text-white">
                            <h3 className="text-2xl font-bold mb-4">{t('developer.welcome')}</h3>
                            <p className="text-white text-opacity-90 max-w-3xl">{t('developer.overview')}</p>
                            <div className="mt-6 flex flex-wrap gap-4">
                                <Link
                                    href={route('game-submissions.create')}
                                    className="inline-flex items-center px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-all duration-200"
                                >
                                    <span>{t('developer.submit_new_game')}</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </Link>
                                <Link
                                    href={route('game-submissions.index')}
                                    className="inline-flex items-center px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-all duration-200"
                                >
                                    <span>{t('developer.manage_games')}</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                        <div className="h-2 bg-gradient-to-r from-yellow-400 via-green-500 to-blue-500"></div>
                    </div>

                    {activeTab === 'overview' && (
                        <>
                            {/* Quick Actions */}
                            <QuickActions />

                            {/* Game Submission Status */}
                            <GameSubmissionStatus stats={stats} />

                            {/* Statistics Overview */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                {/* Stats Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                                        <div className="p-6">
                                            <div className="flex items-center">
                                                <div className="p-3 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white mr-4 shadow-md">
                                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-500">{t('developer.total_games')}</div>
                                                    <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
                                                </div>
                                            </div>
                                            <div className="mt-4 pt-4 border-t border-gray-100">
                                                <Link
                                                    href={route('game-submissions.index')}
                                                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                                                >
                                                    {t('developer.view_all_games')}
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                                        <div className="p-6">
                                            <div className="flex items-center">
                                                <div className="p-3 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 text-white mr-4 shadow-md">
                                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-500">{t('developer.pending_approval')}</div>
                                                    <div className="text-2xl font-bold text-gray-800">{stats.pending}</div>
                                                </div>
                                            </div>
                                            <div className="mt-4 pt-4 border-t border-gray-100">
                                                <Link
                                                    href={route('game-submissions.index', { filter: 'en_attente' })}
                                                    className="text-sm text-yellow-600 hover:text-yellow-800 flex items-center"
                                                >
                                                    {t('developer.view_pending')}
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                                        <div className="p-6">
                                            <div className="flex items-center">
                                                <div className="p-3 rounded-full bg-gradient-to-br from-green-500 to-green-600 text-white mr-4 shadow-md">
                                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-500">{t('developer.approved')}</div>
                                                    <div className="text-2xl font-bold text-gray-800">{stats.published}</div>
                                                </div>
                                            </div>
                                            <div className="mt-4 pt-4 border-t border-gray-100">
                                                <Link
                                                    href={route('game-submissions.index', { filter: 'publie' })}
                                                    className="text-sm text-green-600 hover:text-green-800 flex items-center"
                                                >
                                                    {t('developer.view_published')}
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                                        <div className="p-6">
                                            <div className="flex items-center">
                                                <div className="p-3 rounded-full bg-gradient-to-br from-red-500 to-red-600 text-white mr-4 shadow-md">
                                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-500">{t('developer.rejected')}</div>
                                                    <div className="text-2xl font-bold text-gray-800">{stats.rejected}</div>
                                                </div>
                                            </div>
                                            <div className="mt-4 pt-4 border-t border-gray-100">
                                                <Link
                                                    href={route('game-submissions.index', { filter: 'rejete' })}
                                                    className="text-sm text-red-600 hover:text-red-800 flex items-center"
                                                >
                                                    {t('developer.view_rejected')}
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Chart */}
                                <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                                    <div className="p-6">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">{t('charts.game_status_distribution')}</h3>
                                        <DashboardStatsChart
                                            stats={{
                                                published: stats.published,
                                                pending: stats.pending,
                                                rejected: stats.rejected,
                                                drafts: stats.drafts || (stats.total - stats.published - stats.pending - stats.rejected)
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                                 {/* PDF Generation Component */}
                            <PdfGenerationComponent userRole="developer" />

                            {/* XML Import/Export Component */}
                            <XmlImportExportComponent userRole="developer" />

                            {/* Notifications */}
                            <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100 mb-8">
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                        </svg>
                                        {t('notifications.notifications')}
                                    </h3>
                                    <p className="mb-4 text-gray-600">
                                        {t('notifications.check_notifications_description')}
                                    </p>
                                    <div className="flex justify-center">
                                        <a
                                            href={route('notifications.all')}
                                            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200"
                                        >
                                            {t('notifications.view_all')}
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Performance Metrics
                            <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100 mb-8">
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                        {t('developer.performance_metrics')}
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="flex flex-col p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                                            <div className="text-sm font-medium text-gray-600 mb-1">{t('developer.avg_rating')}</div>
                                            <div className="text-3xl font-bold text-blue-700 mb-2">{stats.avg_rating}</div>
                                            <div className="flex items-center mt-auto">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                                <span className="text-xs text-blue-600 ml-1">Based on all published games</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                                            <div className="text-sm font-medium text-gray-600 mb-1">{t('developer.total_comments')}</div>
                                            <div className="text-3xl font-bold text-green-700 mb-2">{stats.total_comments}</div>
                                            <div className="flex items-center mt-auto">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
                                                </svg>
                                                <span className="text-xs text-green-600 ml-1">Across all your games</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                                            <div className="text-sm font-medium text-gray-600 mb-1">{t('developer.total_views')}</div>
                                            <div className="text-3xl font-bold text-purple-700 mb-2">{stats.total_views.toLocaleString()}</div>
                                            <div className="flex items-center mt-auto">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                                </svg>
                                                <span className="text-xs text-purple-600 ml-1">Total page views</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div> */}
                        </>
                    )}

                    {activeTab === 'activity' && (
                        <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100 mb-8">
                            <div className="p-6">
                                <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {t('developer.recent_activity')}
                                </h3>

                                {/* Enhanced Activity Feed */}
                                <EnhancedActivityFeed activities={recentActivity} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
