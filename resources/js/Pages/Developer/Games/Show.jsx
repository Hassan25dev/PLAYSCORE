import React from 'react';
import { Head, Link } from '@inertiajs/react';
import MainLayout from '../../../Layouts/MainLayout';
import { useTranslation } from '../../../lang/translationHelper';
import RatingsDistributionChart from '../../../Components/Charts/RatingsDistributionChart';

export default function GameShow({ auth, jeu }) {
    const { t } = useTranslation();

    // Prepare ratings data for the chart
    const ratingsCount = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0
    };

    // Count ratings by score
    jeu.evaluations.forEach(evaluation => {
        if (evaluation.note >= 1 && evaluation.note <= 5) {
            ratingsCount[evaluation.note]++;
        }
    });

    return (
        <MainLayout auth={auth} currentUrl={`/developer/games/${jeu.id}/details`}>
            <Head title={jeu.titre} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-6 flex justify-between items-center">
                        <h2 className="font-semibold text-xl text-gray-800 leading-tight">{jeu.titre}</h2>
                        <div className="flex space-x-2">
                            <Link
                                href={route('game-submissions.index')}
                                className="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                            >
                                {t('common.back')}
                            </Link>

                            {jeu.statut === 'rejete' && (
                                <Link
                                    href={route('game-submissions.edit', jeu.id)}
                                    className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-500 focus:bg-indigo-500 active:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                >
                                    {t('game.submission.edit')}
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Game Details */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">{t('game.details')}</h3>

                            {jeu.statut === 'rejete' && jeu.feedback && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                                    <h4 className="font-medium text-red-800 mb-2">{t('game.approval.feedback')}</h4>
                                    <p className="text-red-700">{jeu.feedback}</p>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <div className="mb-4">
                                        <h4 className="text-sm font-medium text-gray-500">{t('game.description')}</h4>
                                        <p className="mt-1">{jeu.description}</p>
                                    </div>

                                    <div className="mb-4">
                                        <h4 className="text-sm font-medium text-gray-500">{t('game.release_date')}</h4>
                                        <p className="mt-1">{new Date(jeu.date_sortie).toLocaleDateString()}</p>
                                    </div>

                                    <div className="mb-4">
                                        <h4 className="text-sm font-medium text-gray-500">{t('game.status')}</h4>
                                        <p className="mt-1 capitalize">{t(`game.status.${jeu.statut}`)}</p>
                                    </div>
                                </div>

                                <div>
                                    {jeu.image_arriere_plan && (
                                        <div className="mb-4">
                                            <img
                                                src={jeu.image_arriere_plan.startsWith('http')
                                                    ? jeu.image_arriere_plan
                                                    : jeu.image_arriere_plan.includes('/storage/')
                                                        ? jeu.image_arriere_plan
                                                        : `/storage/${jeu.image_arriere_plan}`}
                                                alt={jeu.titre}
                                                className="w-full h-auto rounded-md"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = '/images/placeholder-game.png';
                                                }}
                                            />
                                        </div>
                                    )}

                                    {jeu.video_path && (
                                        <div className="mb-4">
                                            <h4 className="text-sm font-medium text-gray-500 mb-2">{t('game.video')}</h4>
                                            <video
                                                src={`/storage/${jeu.video_path}`}
                                                controls
                                                className="w-full h-auto rounded-md"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Ratings and Comments */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* Ratings Chart */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">{t('game.rating')}</h3>
                                {jeu.evaluations.length > 0 ? (
                                    <RatingsDistributionChart ratings={ratingsCount} />
                                ) : (
                                    <p className="text-gray-500">{t('game.no_ratings')}</p>
                                )}
                            </div>
                        </div>

                        {/* Comments */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">{t('game.comments')}</h3>
                                {jeu.comments && jeu.comments.length > 0 ? (
                                    <div className="space-y-4">
                                        {jeu.comments.map(comment => (
                                            <div key={comment.id} className="p-4 bg-gray-50 rounded-md">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="font-medium">{comment.user.name}</p>
                                                        <p className="text-sm text-gray-500">{new Date(comment.created_at).toLocaleString()}</p>
                                                    </div>
                                                </div>
                                                <p className="mt-2">{comment.content}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500">{t('game.no_comments')}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
