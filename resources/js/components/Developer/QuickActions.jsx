import React from 'react';
import { Link } from '@inertiajs/react';
import { useTranslation } from '../../lang/translationHelper';

export default function QuickActions() {
    const { t } = useTranslation();

    return (
        <div className="bg-white overflow-hidden shadow-lg rounded-xl mb-8 border border-gray-100">
            <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    {t('developer.dashboard.quick_actions')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Create New Game */}
                    <Link
                        href={route('game-submissions.create')}
                        className="group relative overflow-hidden rounded-xl bg-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400 opacity-80"></div>
                        <div className="relative p-6 flex flex-col items-center text-center text-white">
                            <div className="p-3 mb-4 bg-white bg-opacity-20 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </div>
                            <h4 className="text-lg font-bold mb-2">{t('developer.dashboard.submit_new')}</h4>
                            <p className="text-sm text-white text-opacity-90">{t('developer.dashboard.submit_new_desc')}</p>
                            <div className="mt-4 inline-flex items-center justify-center w-10 h-10 rounded-full bg-white bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </Link>

                    {/* Continue Draft */}
                    <Link
                        href={route('game-submissions.index', { filter: 'brouillon' })}
                        className="group relative overflow-hidden rounded-xl bg-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-500 opacity-80"></div>
                        <div className="relative p-6 flex flex-col items-center text-center text-white">
                            <div className="p-3 mb-4 bg-white bg-opacity-20 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </div>
                            <h4 className="text-lg font-bold mb-2">{t('developer.dashboard.continue_draft')}</h4>
                            <p className="text-sm text-white text-opacity-90">{t('developer.dashboard.continue_draft_desc')}</p>
                            <div className="mt-4 inline-flex items-center justify-center w-10 h-10 rounded-full bg-white bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </Link>

                    {/* View Published Games */}
                    <Link
                        href={route('game-submissions.index', { filter: 'publie' })}
                        className="group relative overflow-hidden rounded-xl bg-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-400 opacity-80"></div>
                        <div className="relative p-6 flex flex-col items-center text-center text-white">
                            <div className="p-3 mb-4 bg-white bg-opacity-20 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            </div>
                            <h4 className="text-lg font-bold mb-2">{t('developer.dashboard.view_published')}</h4>
                            <p className="text-sm text-white text-opacity-90">{t('developer.dashboard.view_published_desc')}</p>
                            <div className="mt-4 inline-flex items-center justify-center w-10 h-10 rounded-full bg-white bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
