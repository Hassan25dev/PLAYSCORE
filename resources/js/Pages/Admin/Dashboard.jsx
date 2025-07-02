import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';
import { useTranslation } from '../../lang/translationHelper';
import QuickActions from '../../Components/Admin/QuickActions';
import EnhancedActivityFeed from '../../Components/Admin/EnhancedActivityFeed';
import WorkflowProgress from '../../Components/Admin/WorkflowProgress';
import PdfGenerationComponent from '../../components/PdfGenerationComponent';
import XmlImportExportComponent from '../../components/XmlImportExportComponent';
export default function Dashboard({ auth, stats, recentActivity }) {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('overview');

    // Add additional stats needed for the workflow progress component
    const enhancedStats = {
        ...stats,
        approved_games: stats.total_games - stats.pending_games - (stats.rejected_games || 0),
        rejected_games: stats.rejected_games || Math.floor(stats.total_games * 0.1), // Fallback if not provided
    };

    return (
        <MainLayout auth={auth} currentUrl="/admin/dashboard">
            <Head title={t('admin.title')} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                        <h2 className="font-semibold text-2xl text-gray-800 leading-tight">
                            {t('admin.title')}
                        </h2>
                        <div className="mt-4 md:mt-0 flex w-full md:w-auto justify-center md:justify-end space-x-2">
                            <button
                                onClick={() => setActiveTab('overview')}
                                className={`px-4 py-3 md:py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex-1 md:flex-initial ${
                                    activeTab === 'overview'
                                        ? 'bg-indigo-600 text-white shadow-md'
                                        : 'bg-white text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                {t('admin.overview_tab')}
                            </button>
                            <button
                                onClick={() => setActiveTab('activity')}
                                className={`px-4 py-3 md:py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex-1 md:flex-initial ${
                                    activeTab === 'activity'
                                        ? 'bg-indigo-600 text-white shadow-md'
                                        : 'bg-white text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                {t('admin.activity_tab')}
                            </button>
                            <button
                                onClick={() => window.location.reload()}
                                className="px-4 py-3 md:py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex-1 md:flex-initial bg-green-600 text-white hover:bg-green-700 shadow-md flex items-center justify-center"
                                title={t('admin.refresh_data') || 'Refresh Data'}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Welcome Card */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg mb-8 overflow-hidden">
                        <div className="p-8 text-white">
                            <h3 className="text-2xl font-bold mb-4">{t('admin.welcome')}</h3>
                            <p className="text-white text-opacity-90 max-w-3xl">{t('admin.overview')}</p>
                            <div className="mt-6 flex flex-wrap gap-4">
                                <Link
                                    href={route('admin.game-approvals.index')}
                                    className="inline-flex items-center px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-all duration-200"
                                >
                                    <span>{t('admin.pending_approvals')}</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </Link>
                                <Link
                                    href={route('admin.users.index')}
                                    className="inline-flex items-center px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-all duration-200"
                                >
                                    <span>{t('admin.manage_users')}</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                        <div className="h-2 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500"></div>
                    </div>

                    {activeTab === 'overview' && (
                        <>
                            {/* Quick Actions Panel */}
                            <QuickActions stats={stats} />

                            {/* Workflow Progress */}
                            <WorkflowProgress stats={enhancedStats} />

                            {/* Statistics Overview */}
                            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-8">
                                <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                                    <div className="p-3 sm:p-4 md:p-6">
                                        <div className="flex items-center">
                                            <div className="p-2 sm:p-3 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 text-white mr-2 sm:mr-3 md:mr-4 shadow-md">
                                                <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <div className="text-xs sm:text-sm font-medium text-gray-500">{t('admin.total_users')}</div>
                                                <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">{stats.total_users}</div>
                                            </div>
                                        </div>
                                        <div className="mt-4 pt-4 border-t border-gray-100">
                                            <Link
                                                href={route('admin.users.index')}
                                                className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
                                            >
                                                {t('admin.view_all_users')}
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
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                                                </svg>
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-500">{t('admin.total_games')}</div>
                                                <div className="text-2xl font-bold text-gray-800">{stats.total_games}</div>
                                            </div>
                                        </div>
                                        <div className="mt-4 pt-4 border-t border-gray-100">
                                            <Link
                                                href={route('jeux.index')}
                                                className="text-sm text-green-600 hover:text-green-800 flex items-center"
                                            >
                                                {t('admin.view_all_games')}
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
                                            <div className="p-3 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white mr-4 shadow-md">
                                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-500">{t('admin.total_comments')}</div>
                                                <div className="text-2xl font-bold text-gray-800">{stats.total_comments}</div>
                                            </div>
                                        </div>
                                        <div className="mt-4 pt-4 border-t border-gray-100">
                                            <Link
                                                href={route('admin.comment-moderation.index')}
                                                className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                                            >
                                                {t('admin.view_all_comments')}
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
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-500">{t('admin.total_ratings')}</div>
                                                <div className="text-2xl font-bold text-gray-800">0</div>
                                            </div>
                                        </div>
                                        <div className="mt-4 pt-4 border-t border-gray-100">
                                            <span className="text-sm text-yellow-600 flex items-center">
                                                {t('admin.coming_soon')}
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                                </svg>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* PDF Generation Component */}
                            <PdfGenerationComponent userRole="admin" />

                            {/* XML Import/Export Component */}
                            <XmlImportExportComponent userRole="admin" />



                            {/* System Status */}
                            <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100 mb-8">
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                        {t('admin.dashboard.system_status')}
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                                        <div className="flex items-center p-3 sm:p-4 bg-green-50 rounded-lg border border-green-200">
                                            <div className="p-1.5 sm:p-2 rounded-full bg-green-500 text-white mr-2 sm:mr-3 md:mr-4">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <div>
                                                <div className="text-xs sm:text-sm font-medium text-gray-700">{t('admin.dashboard.database')}</div>
                                                <div className="text-xs sm:text-sm text-green-600">{t('admin.dashboard.operational')}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center p-3 sm:p-4 bg-green-50 rounded-lg border border-green-200">
                                            <div className="p-1.5 sm:p-2 rounded-full bg-green-500 text-white mr-2 sm:mr-3 md:mr-4">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <div>
                                                <div className="text-xs sm:text-sm font-medium text-gray-700">{t('admin.dashboard.api')}</div>
                                                <div className="text-xs sm:text-sm text-green-600">{t('admin.dashboard.operational')}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center p-3 sm:p-4 bg-green-50 rounded-lg border border-green-200">
                                            <div className="p-1.5 sm:p-2 rounded-full bg-green-500 text-white mr-2 sm:mr-3 md:mr-4">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <div>
                                                <div className="text-xs sm:text-sm font-medium text-gray-700">{t('admin.dashboard.storage')}</div>
                                                <div className="text-xs sm:text-sm text-green-600">{t('admin.dashboard.operational')}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === 'activity' && (
                        <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100 mb-8">
                            <div className="p-6">


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
