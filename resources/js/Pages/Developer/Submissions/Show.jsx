import React from 'react';
import { Head, Link } from '@inertiajs/react';
import DeveloperLayout from '../../../Layouts/DeveloperLayout';
import { useTranslation } from '../../../lang/translationHelper';

export default function SubmissionShow({ auth, jeu, evaluations }) {
    const { t } = useTranslation();

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString();
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'en_attente':
                return 'bg-yellow-100 text-yellow-800';
            case 'publie':
                return 'bg-green-100 text-green-800';
            case 'rejete':
                return 'bg-red-100 text-red-800';
            case 'brouillon':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'en_attente':
                return t('developer.submission.status_pending');
            case 'publie':
                return t('developer.submission.status_published');
            case 'rejete':
                return t('developer.submission.status_rejected');
            case 'brouillon':
                return t('developer.submission.status_draft');
            default:
                return status;
        }
    };

    return (
        <DeveloperLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{t('developer.submission.view_game')}</h2>}
        >
            <Head title={jeu.titre} />

            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                <div className="p-6 flex justify-between items-center">
                    <div>
                        <Link
                            href={route('game-submissions.index')}
                            className="text-blue-600 hover:text-blue-900"
                        >
                            ← {t('admin.actions.back')}
                        </Link>
                    </div>
                    <div className="flex space-x-2">
                        {jeu.statut === 'brouillon' && (
                            <Link
                                href={route('game-submissions.edit', jeu.id)}
                                className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                            >
                                {t('admin.actions.edit')}
                            </Link>
                        )}
                        {jeu.statut === 'rejete' && (
                            <Link
                                href={route('game-submissions.edit', jeu.id)}
                                className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                            >
                                {t('developer.submission.resubmit')}
                            </Link>
                        )}
                        {jeu.statut === 'publie' && (
                            <Link
                                href={route('jeux.show', jeu.id)}
                                className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700 focus:bg-green-700 active:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                target="_blank"
                            >
                                {t('developer.submission.view_public')}
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="md:col-span-2">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-2xl font-bold text-gray-900">{jeu.titre}</h3>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(jeu.statut)}`}>
                                    {getStatusLabel(jeu.statut)}
                                </span>
                            </div>

                            {jeu.image_arriere_plan && (
                                <div className="mb-6">
                                    <img
                                        src={`/storage/${jeu.image_arriere_plan}`}
                                        alt={jeu.titre}
                                        className="w-full h-64 object-cover rounded-lg"
                                    />
                                </div>
                            )}

                            <div className="mb-6">
                                <h4 className="text-lg font-medium text-gray-900 mb-2">{t('developer.submission.description')}</h4>
                                <div className="text-gray-700 whitespace-pre-wrap">
                                    {jeu.description}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <h4 className="text-lg font-medium text-gray-900 mb-2">{t('developer.submission.release_date')}</h4>
                                    <div className="text-gray-700">
                                        {formatDate(jeu.date_sortie)}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-lg font-medium text-gray-900 mb-2">{t('developer.submission.submission_date')}</h4>
                                    <div className="text-gray-700">
                                        {formatDate(jeu.submitted_at || jeu.created_at)}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="text-lg font-medium text-gray-900 mb-2">{t('developer.submission.platforms')}</h4>
                                    {jeu.plateformes && jeu.plateformes.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {jeu.plateformes.map(plateforme => (
                                                <span key={plateforme.id} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    {plateforme.nom}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-gray-500">{t('developer.submission.no_platforms')}</div>
                                    )}
                                </div>

                                <div>
                                    <h4 className="text-lg font-medium text-gray-900 mb-2">{t('developer.submission.genres')}</h4>
                                    {jeu.genres && jeu.genres.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {jeu.genres.map(genre => (
                                                <span key={genre.id} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                    {genre.nom}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-gray-500">{t('developer.submission.no_genres')}</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {jeu.statut === 'en_attente' && (
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-yellow-700 mb-2">{t('developer.submission.pending_info')}</h3>
                                <div className="bg-yellow-50 p-4 rounded-md text-yellow-700">
                                    <div className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-yellow-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>{t('developer.submission.pending_review_message')}</span>
                                    </div>
                                    <div className="mt-3 text-sm">
                                        {t('developer.submission.pending_review_description')}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {jeu.statut === 'publie' && jeu.approved_at && (
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-green-700 mb-2">{t('developer.submission.approval_info')}</h3>
                                <div className="bg-green-50 p-4 rounded-md text-green-700">
                                    <div className="flex items-center">
                                        <svg className="h-5 w-5 mr-3 text-green-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>{t('developer.submission.approved_message')}</span>
                                    </div>
                                    <div className="mt-3 text-sm">
                                        {t('developer.submission.approved_description')}
                                    </div>
                                    <div className="mt-4">
                                        <Link
                                            href={route('jeux.show', jeu.id)}
                                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                            target="_blank"
                                        >
                                            {t('developer.submission.view_public')}
                                            <svg className="ml-2 -mr-0.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}



                    {jeu.statut === 'rejete' && jeu.feedback && (
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                            <div className="p-6 space-y-3">
                                <h3 className="text-lg font-medium text-red-700 mb-2">{t('developer.submission.rejection_feedback')}</h3>
                                <div className="bg-red-50 p-4 rounded-md text-red-700 whitespace-pre-wrap">
                                    {jeu.feedback}
                                </div>
                            </div>
                        </div>
                    )}



                    {evaluations && evaluations.length > 0 && (
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">{t('developer.submission.ratings')} & {t('developer.dashboard.reviews')}</h3>
                                <div className="space-y-4">
                                    {evaluations.map(evaluation => (
                                        <div key={`${evaluation.utilisateur_id}_${evaluation.jeu_id}`}
                                            className={`p-4 rounded-md ${evaluation.is_approved ? 'bg-gray-50' : evaluation.is_flagged ? 'bg-red-50' : 'bg-yellow-50'}`}>
                                            <div className="flex justify-between mb-2">
                                                <div className="font-medium text-gray-700">
                                                    {evaluation.utilisateur ? evaluation.utilisateur.name : 'Unknown'}
                                                    <span className="text-gray-500 text-sm ml-2">
                                                        {formatDate(evaluation.created_at)}
                                                    </span>
                                                    {evaluation.is_approved ? (
                                                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                            {t('developer.status.approved')}
                                                        </span>
                                                    ) : evaluation.is_flagged ? (
                                                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                            {t('developer.status.flagged')}
                                                        </span>
                                                    ) : (
                                                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                            {t('developer.status.pending')}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center">
                                                    <div className="text-sm font-medium text-gray-700 mr-2">Rating:</div>
                                                    <div className="flex items-center">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <svg
                                                                key={star}
                                                                className={`w-4 h-4 ${star <= evaluation.note ? 'text-yellow-500' : 'text-gray-300'}`}
                                                                fill="currentColor"
                                                                viewBox="0 0 20 20"
                                                            >
                                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                            </svg>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            {evaluation.commentaire && (
                                                <div className="text-gray-700 whitespace-pre-wrap mt-2">
                                                    {evaluation.commentaire}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="md:col-span-1">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">{t('developer.submission.status_info')}</h3>

                            <div className="space-y-4">
                                <div>
                                    <div className="text-sm font-medium text-gray-500">{t('developer.submission.current_status')}</div>
                                    <div className="mt-1">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(jeu.statut)}`}>
                                            {getStatusLabel(jeu.statut)}
                                        </span>
                                    </div>
                                </div>

                                {jeu.submitted_at && (
                                    <div>
                                        <div className="text-sm font-medium text-gray-500">{t('developer.submission.submission_date')}</div>
                                        <div className="mt-1 text-gray-900">{formatDate(jeu.submitted_at)}</div>
                                    </div>
                                )}

                                {jeu.approved_at && (
                                    <div>
                                        <div className="text-sm font-medium text-gray-500">{t('developer.submission.approval_date')}</div>
                                        <div className="mt-1 text-gray-900">{formatDate(jeu.approved_at)}</div>
                                    </div>
                                )}

                                {jeu.rejected_at && (
                                    <div>
                                        <div className="text-sm font-medium text-gray-500">{t('developer.submission.rejection_date')}</div>
                                        <div className="mt-1 text-gray-900">{formatDate(jeu.rejected_at)}</div>
                                    </div>
                                )}

                                {jeu.statut === 'brouillon' && (
                                    <div className="pt-4 space-y-3">
                                        <Link
                                            href={route('game-submissions.edit', jeu.id)}
                                            className="w-full inline-flex justify-center items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                        >
                                            {t('admin.actions.edit')}
                                        </Link>

                                        <Link
                                            href={route('game-submissions.submit', jeu.id)}
                                            method="post"
                                            as="button"
                                            className="w-full inline-flex justify-center items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700 focus:bg-green-700 active:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                        >
                                            {t('developer.submission.submit')}
                                        </Link>
                                    </div>
                                )}

                                {jeu.statut === 'rejete' && (
                                    <div className="pt-4">
                                        <Link
                                            href={route('game-submissions.edit', jeu.id)}
                                            className="w-full inline-flex justify-center items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                        >
                                            {t('developer.submission.resubmit')}
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {jeu.statut === 'publie' && (
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">{t('developer.statistics.title')}</h3>

                                <div className="space-y-4">
                                    <div>
                                        <div className="text-sm font-medium text-gray-500">{t('developer.statistics.views')}</div>
                                        <div className="mt-1 text-2xl font-semibold text-gray-900">0</div>
                                    </div>

                                    <div>
                                        <div className="text-sm font-medium text-gray-500">{t('developer.statistics.ratings')}</div>
                                        <div className="mt-1 text-2xl font-semibold text-gray-900">{evaluations ? evaluations.length : 0}</div>
                                    </div>

                                    <div>
                                        <div className="text-sm font-medium text-gray-500">{t('developer.statistics.average_rating')}</div>
                                        <div className="mt-1 text-2xl font-semibold text-gray-900">
                                            {evaluations && evaluations.length > 0
                                                ? (evaluations.reduce((sum, evaluation) => sum + evaluation.note, 0) / evaluations.length).toFixed(1)
                                                : 'N/A'}
                                        </div>
                                    </div>


                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </DeveloperLayout>
    );
}
