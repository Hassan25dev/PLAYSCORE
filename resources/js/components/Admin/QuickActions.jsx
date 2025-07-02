import React from 'react';
import { Link } from '@inertiajs/react';
import { useTranslation } from '../../lang/translationHelper';

export default function QuickActions({ stats }) {
    const { t } = useTranslation();

    return (
        <div className="bg-white overflow-hidden shadow-lg rounded-xl mb-8 border border-gray-100">
            <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    {t('admin.dashboard.quick_actions')}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {/* Pending Games Approval */}
                    <Link
                        href={route('admin.game-approvals.index')}
                        className="flex flex-col p-4 sm:p-5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl hover:shadow-md active:shadow-inner transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 border border-blue-200 group min-h-[120px] sm:min-h-0"
                    >
                        <div className="flex items-center mb-3 sm:mb-4">
                            <div className="p-2.5 sm:p-3 mr-3 sm:mr-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg text-white shadow-md group-hover:shadow-lg transition-all duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-700">{t('admin.game_approval.pending_games')}</p>
                            </div>
                        </div>
                        <div className="flex justify-between items-center mt-auto">
                            <p className="text-2xl sm:text-3xl font-bold text-blue-700">{stats.pending_games}</p>
                            <span className="text-blue-600 group-hover:text-blue-800 transition-colors p-1 rounded-full hover:bg-blue-200 hover:bg-opacity-50">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </span>
                        </div>
                    </Link>

                    {/* Pending Comments */}
                    <Link
                        href={route('admin.comment-moderation.index')}
                        className="flex flex-col p-4 sm:p-5 bg-gradient-to-br from-green-50 to-green-100 rounded-xl hover:shadow-md active:shadow-inner transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 border border-green-200 group min-h-[120px] sm:min-h-0"
                    >
                        <div className="flex items-center mb-3 sm:mb-4">
                            <div className="p-2.5 sm:p-3 mr-3 sm:mr-4 bg-gradient-to-br from-green-500 to-green-600 rounded-lg text-white shadow-md group-hover:shadow-lg transition-all duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-700">{t('admin.comment_moderation.pending_comments')}</p>
                            </div>
                        </div>
                        <div className="flex justify-between items-center mt-auto">
                            <p className="text-2xl sm:text-3xl font-bold text-green-700">{stats.pending_comments}</p>
                            <span className="text-green-600 group-hover:text-green-800 transition-colors p-1 rounded-full hover:bg-green-200 hover:bg-opacity-50">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </span>
                        </div>
                    </Link>

                    {/* Flagged Comments */}
                    <Link
                        href={route('admin.comment-moderation.flagged')}
                        className="flex flex-col p-4 sm:p-5 bg-gradient-to-br from-red-50 to-red-100 rounded-xl hover:shadow-md active:shadow-inner transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 border border-red-200 group min-h-[120px] sm:min-h-0"
                    >
                        <div className="flex items-center mb-3 sm:mb-4">
                            <div className="p-2.5 sm:p-3 mr-3 sm:mr-4 bg-gradient-to-br from-red-500 to-red-600 rounded-lg text-white shadow-md group-hover:shadow-lg transition-all duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-700">{t('admin.comment_moderation.flagged_comments')}</p>
                            </div>
                        </div>
                        <div className="flex justify-between items-center mt-auto">
                            <p className="text-2xl sm:text-3xl font-bold text-red-700">{stats.flagged_comments}</p>
                            <span className="text-red-600 group-hover:text-red-800 transition-colors p-1 rounded-full hover:bg-red-200 hover:bg-opacity-50">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </span>
                        </div>
                    </Link>

                    {/* User Management */}
                    <Link
                        href={route('admin.users.index')}
                        className="flex flex-col p-4 sm:p-5 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl hover:shadow-md active:shadow-inner transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 border border-purple-200 group min-h-[120px] sm:min-h-0"
                    >
                        <div className="flex items-center mb-3 sm:mb-4">
                            <div className="p-2.5 sm:p-3 mr-3 sm:mr-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg text-white shadow-md group-hover:shadow-lg transition-all duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-700">{t('admin.user_management.title')}</p>
                            </div>
                        </div>
                        <div className="flex justify-between items-center mt-auto">
                            <p className="text-2xl sm:text-3xl font-bold text-purple-700">{stats.total_users}</p>
                            <span className="text-purple-600 group-hover:text-purple-800 transition-colors p-1 rounded-full hover:bg-purple-200 hover:bg-opacity-50">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </span>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
