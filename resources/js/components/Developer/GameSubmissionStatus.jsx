import React from 'react';
import { Link } from '@inertiajs/react';
import { useTranslation } from '../../lang/translationHelper';

export default function GameSubmissionStatus({ stats }) {
    const { t } = useTranslation();

    return (
        <div className="bg-white overflow-hidden shadow-lg rounded-xl mb-8 border border-gray-100">
            <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    {t('developer.dashboard.submission_status')}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Draft Games */}
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
                        <div className="flex items-center mb-3">
                            <div className="w-4 h-4 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full mr-2 shadow-sm"></div>
                            <span className="text-sm font-semibold text-gray-700">{t('developer.dashboard.drafts')}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="text-3xl font-bold text-gray-700">{stats.drafts || 0}</div>
                            <Link
                                href={route('game-submissions.index', { filter: 'brouillon' })}
                                className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center"
                            >
                                {t('developer.actions.view')}
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                            </Link>
                        </div>
                    </div>

                    {/* Pending Games */}
                    <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-5 rounded-xl shadow-sm border border-yellow-200 hover:shadow-md transition-all duration-300">
                        <div className="flex items-center mb-3">
                            <div className="w-4 h-4 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full mr-2 shadow-sm"></div>
                            <span className="text-sm font-semibold text-gray-700">{t('developer.dashboard.pending_approval')}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="text-3xl font-bold text-yellow-700">{stats.pending || 0}</div>
                            <Link
                                href={route('game-submissions.index', { filter: 'en_attente' })}
                                className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center"
                            >
                                {t('developer.actions.view')}
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                            </Link>
                        </div>
                    </div>

                    {/* Published Games */}
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-xl shadow-sm border border-green-200 hover:shadow-md transition-all duration-300">
                        <div className="flex items-center mb-3">
                            <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-green-600 rounded-full mr-2 shadow-sm"></div>
                            <span className="text-sm font-semibold text-gray-700">{t('developer.dashboard.published')}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="text-3xl font-bold text-green-700">{stats.published || 0}</div>
                            <Link
                                href={route('game-submissions.index', { filter: 'publie' })}
                                className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center"
                            >
                                {t('developer.actions.view')}
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                            </Link>
                        </div>
                    </div>

                    {/* Rejected Games */}
                    <div className="bg-gradient-to-br from-red-50 to-red-100 p-5 rounded-xl shadow-sm border border-red-200 hover:shadow-md transition-all duration-300">
                        <div className="flex items-center mb-3">
                            <div className="w-4 h-4 bg-gradient-to-r from-red-500 to-red-600 rounded-full mr-2 shadow-sm"></div>
                            <span className="text-sm font-semibold text-gray-700">{t('developer.dashboard.rejected')}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="text-3xl font-bold text-red-700">{stats.rejected || 0}</div>
                            <Link
                                href={route('game-submissions.index', { filter: 'rejete' })}
                                className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center"
                            >
                                {t('developer.actions.view')}
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Submission Progress */}
                <div className="mt-8 bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-semibold text-gray-800 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                            {t('developer.dashboard.submission_progress')}
                        </span>
                        <span className="text-sm font-medium px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full">
                            {stats.total} {t('developer.dashboard.total_games')}
                        </span>
                    </div>
                    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                        {stats.total > 0 ? (
                            <div className="flex h-full">
                                <div
                                    className="bg-gradient-to-r from-gray-400 to-gray-500 transition-all duration-500"
                                    style={{ width: `${(stats.drafts / stats.total) * 100}%` }}
                                    title={`${t('developer.dashboard.drafts')}: ${stats.drafts}`}
                                ></div>
                                <div
                                    className="bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-500"
                                    style={{ width: `${(stats.pending / stats.total) * 100}%` }}
                                    title={`${t('developer.dashboard.pending_approval')}: ${stats.pending}`}
                                ></div>
                                <div
                                    className="bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500"
                                    style={{ width: `${(stats.published / stats.total) * 100}%` }}
                                    title={`${t('developer.dashboard.published')}: ${stats.published}`}
                                ></div>
                                <div
                                    className="bg-gradient-to-r from-red-500 to-red-600 transition-all duration-500"
                                    style={{ width: `${(stats.rejected / stats.total) * 100}%` }}
                                    title={`${t('developer.dashboard.rejected')}: ${stats.rejected}`}
                                ></div>
                            </div>
                        ) : (
                            <div className="flex justify-center items-center h-full text-xs text-gray-500">
                                {t('developer.dashboard.no_games_progress')}
                            </div>
                        )}
                    </div>
                    <div className="flex justify-between mt-3 text-xs font-medium">
                        <span className="flex items-center">
                            <div className="w-3 h-3 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full mr-1"></div>
                            {t('developer.dashboard.drafts')}
                        </span>
                        <span className="flex items-center">
                            <div className="w-3 h-3 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full mr-1"></div>
                            {t('developer.dashboard.pending_approval')}
                        </span>
                        <span className="flex items-center">
                            <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-green-600 rounded-full mr-1"></div>
                            {t('developer.dashboard.published')}
                        </span>
                        <span className="flex items-center">
                            <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-red-600 rounded-full mr-1"></div>
                            {t('developer.dashboard.rejected')}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
