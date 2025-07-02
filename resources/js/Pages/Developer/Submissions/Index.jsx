import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import DeveloperLayout from '../../../Layouts/DeveloperLayout';
import { useTranslation } from '../../../lang/translationHelper';
import { Tab } from '@headlessui/react';

export default function SubmissionsIndex({ auth, submissions, stats, filter }) {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');

    // Debug logging for filter parameter
    console.log('Developer Submissions Index - Filter parameter:', filter);

    // Debug logging for received props
    console.log('Developer Submissions Index - Auth:', auth);
    console.log('Developer Submissions Index - Submissions:', submissions);
    console.log('Developer Submissions Index - Stats:', stats);

    // Function to determine the default tab index based on the filter parameter
    const getDefaultTabIndex = () => {
        if (!filter) return 0; // Default to "All Games" tab

        switch (filter) {
            case 'brouillon':
                return 1; // Drafts tab
            case 'en_attente':
                return 2; // Pending tab
            case 'publie':
                return 3; // Published tab
            case 'rejete':
                return 4; // Rejected tab
            default:
                return 0; // Default to "All Games" tab
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString();
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'en_attente':
                return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
            case 'publie':
                return 'bg-green-100 text-green-800 border border-green-200';
            case 'rejete':
                return 'bg-red-100 text-red-800 border border-red-200';
            case 'brouillon':
                return 'bg-gray-100 text-gray-800 border border-gray-200';
            default:
                return 'bg-gray-100 text-gray-800 border border-gray-200';
        }
    };

    // Filter submissions based on search term
    const filterSubmissions = (submissionList) => {
        console.log('filterSubmissions called with:', submissionList);

        if (!submissionList) {
            console.log('filterSubmissions: submissionList is null or undefined, returning empty array');
            return [];
        }

        const filtered = submissionList.filter(submission =>
            submission && submission.titre && submission.titre.toLowerCase().includes(searchTerm.toLowerCase())
        );

        console.log('filterSubmissions: filtered result:', filtered);
        return filtered;
    };

    // Render empty state when no games are available
    const renderEmptyState = () => (
        <div className="bg-gray-50 rounded-xl p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">{t('developer.submission.no_games')}</h3>
            <p className="text-gray-600 mb-6">{t('developer.submission.no_games_description')}</p>
            <Link
                href={route('game-submissions.create')}
                className="inline-flex items-center px-4 py-2 bg-teal-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-teal-700 focus:bg-teal-700 active:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition ease-in-out duration-150"
            >
                {t('developer.dashboard.submit_new')}
            </Link>
        </div>
    );

    // Render game card
    const renderGameCard = (submission) => {
        // Debug logging for individual game card rendering
        console.log('Rendering game card for submission:', submission);

        return (
            <div key={submission.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
                <div className="relative">
                    {submission.image_arriere_plan ? (
                        <img
                            src={`/storage/${submission.image_arriere_plan}`}
                            alt={submission.titre}
                            className="w-full h-40 object-cover"
                            onError={(e) => {
                                e.target.onerror = null; // Prevent infinite loop
                                e.target.style.display = 'none'; // Hide the img element
                                e.target.parentNode.classList.add('bg-gray-200', 'flex', 'items-center', 'justify-center');

                                // Create and append the SVG placeholder
                                const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                                svg.setAttribute('class', 'h-12 w-12 text-gray-400');
                                svg.setAttribute('fill', 'none');
                                svg.setAttribute('viewBox', '0 0 24 24');
                                svg.setAttribute('stroke', 'currentColor');

                                const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                                path.setAttribute('stroke-linecap', 'round');
                                path.setAttribute('stroke-linejoin', 'round');
                                path.setAttribute('stroke-width', '1.5');
                                path.setAttribute('d', 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z');

                                svg.appendChild(path);
                                e.target.parentNode.appendChild(svg);
                            }}
                        />
                    ) : (
                        <div className="w-full h-40 bg-gray-200 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    )}
                    <div className="absolute top-2 right-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(submission.statut)}`}>
                            {t(`developer.submission.status.${submission.statut}`)}
                        </span>
                    </div>
                </div>
                <div className="p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-1 truncate">{submission.titre}</h3>
                    <p className="text-sm text-gray-600 mb-3">
                        {t('developer.submission.submitted')}: {formatDate(submission.created_at)}
                    </p>
                    <div className="flex justify-between items-center">
                        <Link
                            href={route('game-submissions.show', submission.id)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                        >
                            {t('admin.actions.view')}
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                            </svg>
                        </Link>

                        {submission.statut === 'brouillon' && (
                            <Link
                                href={route('game-submissions.edit', submission.id)}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                            >
                                {t('admin.actions.edit')}
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                </svg>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <DeveloperLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{t('developer.dashboard.my_games')}</h2>}
        >
            <Head title={t('developer.dashboard.my_games')} />

            <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-xl shadow-lg mb-8 overflow-hidden">
                <div className="p-8 text-white">
                    <h3 className="text-2xl font-bold mb-2">{t('developer.dashboard.my_games')}</h3>
                    <p className="text-white text-opacity-90 max-w-3xl mb-6">
                        {t('developer.submission.index_description') || 'Manage your game submissions, track their status, and submit new games.'}
                    </p>

                    <div className="flex items-center">
                        <Link
                            href={route('game-submissions.create')}
                            className="inline-flex items-center px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-all duration-200"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            <span>{t('developer.dashboard.submit_new')}</span>
                        </Link>
                    </div>
                </div>
                <div className="h-2 bg-gradient-to-r from-yellow-400 via-green-500 to-blue-500"></div>
            </div>

            <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100 mb-8">
                <div className="p-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                        <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                            </svg>
                            {t('developer.dashboard.my_games')}
                        </h3>

                        <div className="w-full md:w-64">
                            <input
                                type="text"
                                placeholder={t('admin.actions.search')}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="mb-8">
                        <Tab.Group defaultIndex={getDefaultTabIndex()}>
                        <Tab.List className="flex space-x-1 rounded-xl bg-blue-50 p-1">
                            <Tab
                                className={({ selected }) =>
                                    `w-full rounded-lg py-2.5 text-sm font-medium leading-5
                                    ${selected
                                        ? 'bg-white text-blue-700 shadow'
                                        : 'text-blue-600 hover:bg-white/[0.12] hover:text-blue-700'
                                    }`
                                }
                            >
                                {t('developer.dashboard.all_games')} ({stats.total || 0})
                            </Tab>
                            <Tab
                                className={({ selected }) =>
                                    `w-full rounded-lg py-2.5 text-sm font-medium leading-5
                                    ${selected
                                        ? 'bg-white text-blue-700 shadow'
                                        : 'text-blue-600 hover:bg-white/[0.12] hover:text-blue-700'
                                    }`
                                }
                            >
                                {t('developer.dashboard.drafts')} ({stats.drafts || 0})
                            </Tab>
                            <Tab
                                className={({ selected }) =>
                                    `w-full rounded-lg py-2.5 text-sm font-medium leading-5
                                    ${selected
                                        ? 'bg-white text-blue-700 shadow'
                                        : 'text-blue-600 hover:bg-white/[0.12] hover:text-blue-700'
                                    }`
                                }
                            >
                                {t('developer.dashboard.pending')} ({stats.pending || 0})
                            </Tab>
                            <Tab
                                className={({ selected }) =>
                                    `w-full rounded-lg py-2.5 text-sm font-medium leading-5
                                    ${selected
                                        ? 'bg-white text-blue-700 shadow'
                                        : 'text-blue-600 hover:bg-white/[0.12] hover:text-blue-700'
                                    }`
                                }
                            >
                                {t('developer.dashboard.published')} ({stats.published || 0})
                            </Tab>
                            <Tab
                                className={({ selected }) =>
                                    `w-full rounded-lg py-2.5 text-sm font-medium leading-5
                                    ${selected
                                        ? 'bg-white text-blue-700 shadow'
                                        : 'text-blue-600 hover:bg-white/[0.12] hover:text-blue-700'
                                    }`
                                }
                            >
                                {t('developer.dashboard.rejected')} ({stats.rejected || 0})
                            </Tab>
                        </Tab.List>
                        <Tab.Panels className="mt-6">
                            {/* All Games */}
                            <Tab.Panel>
                                {console.log('All Games Tab - Total games:', stats.total)}
                                {console.log('All Games Tab - Submissions data:', submissions)}
                                {stats.total > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {(() => {
                                            // Flatten the arrays from each status category
                                            const allGames = [
                                                ...(Array.isArray(submissions.brouillon) ? submissions.brouillon : []),
                                                ...(Array.isArray(submissions.en_attente) ? submissions.en_attente : []),
                                                ...(Array.isArray(submissions.publie) ? submissions.publie : []),
                                                ...(Array.isArray(submissions.rejete) ? submissions.rejete : [])
                                            ];

                                            console.log('All Games Tab - Flattened games array:', allGames);

                                            const filteredGames = allGames.filter(submission =>
                                                submission && submission.titre && submission.titre.toLowerCase().includes(searchTerm.toLowerCase())
                                            );
                                            console.log('All Games Tab - Filtered games:', filteredGames);

                                            return filteredGames.map((submission, index) => (
                                                <React.Fragment key={submission.id || index}>
                                                    {renderGameCard(submission)}
                                                </React.Fragment>
                                            ));
                                        })()}
                                    </div>
                                ) : (
                                    renderEmptyState()
                                )}
                            </Tab.Panel>

                            {/* Drafts */}
                            <Tab.Panel>
                                {console.log('Drafts Tab - Submissions data:', submissions.brouillon)}
                                {Array.isArray(submissions.brouillon) && submissions.brouillon.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {submissions.brouillon
                                            .filter(submission =>
                                                submission && submission.titre && submission.titre.toLowerCase().includes(searchTerm.toLowerCase())
                                            )
                                            .map((submission, index) => (
                                                <React.Fragment key={submission.id || index}>
                                                    {renderGameCard(submission)}
                                                </React.Fragment>
                                            ))
                                        }
                                    </div>
                                ) : (
                                    <div className="bg-gray-50 rounded-xl p-8 text-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">{t('developer.submission.no_drafts')}</h3>
                                        <p className="text-gray-600 mb-6">{t('developer.submission.no_drafts_description')}</p>
                                        <Link
                                            href={route('game-submissions.create')}
                                            className="inline-flex items-center px-4 py-2 bg-teal-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-teal-700 focus:bg-teal-700 active:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                        >
                                            {t('developer.dashboard.submit_new')}
                                        </Link>
                                    </div>
                                )}
                            </Tab.Panel>

                            {/* Pending */}
                            <Tab.Panel>
                                {console.log('Pending Tab - Submissions data:', submissions.en_attente)}
                                {Array.isArray(submissions.en_attente) && submissions.en_attente.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {submissions.en_attente
                                            .filter(submission =>
                                                submission && submission.titre && submission.titre.toLowerCase().includes(searchTerm.toLowerCase())
                                            )
                                            .map((submission, index) => (
                                                <React.Fragment key={submission.id || index}>
                                                    {renderGameCard(submission)}
                                                </React.Fragment>
                                            ))
                                        }
                                    </div>
                                ) : (
                                    <div className="bg-gray-50 rounded-xl p-8 text-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">{t('developer.submission.no_pending')}</h3>
                                        <p className="text-gray-600 mb-6">{t('developer.submission.no_pending_description')}</p>
                                    </div>
                                )}
                            </Tab.Panel>

                            {/* Published */}
                            <Tab.Panel>
                                {console.log('Published Tab - Submissions data:', submissions.publie)}
                                {Array.isArray(submissions.publie) && submissions.publie.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {submissions.publie
                                            .filter(submission =>
                                                submission && submission.titre && submission.titre.toLowerCase().includes(searchTerm.toLowerCase())
                                            )
                                            .map((submission, index) => (
                                                <React.Fragment key={submission.id || index}>
                                                    {renderGameCard(submission)}
                                                </React.Fragment>
                                            ))
                                        }
                                    </div>
                                ) : (
                                    <div className="bg-gray-50 rounded-xl p-8 text-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">{t('developer.submission.no_published')}</h3>
                                        <p className="text-gray-600 mb-6">{t('developer.submission.no_published_description')}</p>
                                    </div>
                                )}
                            </Tab.Panel>

                            {/* Rejected */}
                            <Tab.Panel>
                                {console.log('Rejected Tab - Submissions data:', submissions.rejete)}
                                {Array.isArray(submissions.rejete) && submissions.rejete.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {submissions.rejete
                                            .filter(submission =>
                                                submission && submission.titre && submission.titre.toLowerCase().includes(searchTerm.toLowerCase())
                                            )
                                            .map((submission, index) => (
                                                <React.Fragment key={submission.id || index}>
                                                    {renderGameCard(submission)}
                                                </React.Fragment>
                                            ))
                                        }
                                    </div>
                                ) : (
                                    <div className="bg-gray-50 rounded-xl p-8 text-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">{t('developer.submission.no_rejected')}</h3>
                                        <p className="text-gray-600 mb-6">{t('developer.submission.no_rejected_description')}</p>
                                    </div>
                                )}
                            </Tab.Panel>
                        </Tab.Panels>
                        </Tab.Group>
                    </div>
                </div>
            </div>
        </DeveloperLayout>
    );
}
