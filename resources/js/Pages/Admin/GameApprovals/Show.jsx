import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { useTranslation } from '../../../lang/translationHelper';
import TextInput from '../../../Components/TextInput';
import TextArea from '../../../Components/TextArea';
import InputLabel from '../../../Components/InputLabel';
import PrimaryButton from '../../../Components/PrimaryButton';
import SecondaryButton from '../../../Components/SecondaryButton';
import DangerButton from '../../../Components/DangerButton';

export default function GameApprovalShow({ auth, game }) {
    const { t } = useTranslation();
    const [showFeedbackForm, setShowFeedbackForm] = useState(false);
    const [action, setAction] = useState('');

    const { data, setData, put, processing, errors, reset } = useForm({
        action: '',
        feedback: '',
    });

    const handleApprove = () => {
        setAction('approve');
        setShowFeedbackForm(true);
    };

    const handleReject = () => {
        setAction('reject');
        setShowFeedbackForm(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        data.action = action;

        put(route('admin.game-approvals.update', game.id), {
            onSuccess: () => {
                reset();
                setShowFeedbackForm(false);
            },
        });
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <AdminLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{t('admin.game_approval.view_details')}</h2>}
        >
            <Head title={`${t('admin.game_approval.view_details')} - ${game.titre}`} />

            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                <div className="p-6 flex justify-between items-center">
                    <div>
                        <Link
                            href={route('admin.game-approvals.index')}
                            className="text-indigo-600 hover:text-indigo-900"
                        >
                            ← {t('admin.actions.back')}
                        </Link>
                    </div>
                    <div className="flex space-x-2">
                        {!showFeedbackForm && (
                            <>
                                <PrimaryButton onClick={handleApprove}>
                                    {t('admin.game_approval.approve')}
                                </PrimaryButton>
                                <DangerButton onClick={handleReject}>
                                    {t('admin.game_approval.reject')}
                                </DangerButton>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {showFeedbackForm && (
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                    <div className="p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            {action === 'approve'
                                ? t('admin.game_approval.provide_feedback')
                                : t('admin.game_approval.provide_feedback')}
                        </h3>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <InputLabel htmlFor="feedback" value={t('admin.game_approval.feedback_placeholder')} />
                                <TextArea
                                    id="feedback"
                                    className="mt-1 block w-full"
                                    value={data.feedback}
                                    onChange={(e) => setData('feedback', e.target.value)}
                                    rows={4}
                                />
                            </div>
                            <div className="flex justify-end space-x-2">
                                <SecondaryButton onClick={() => setShowFeedbackForm(false)}>
                                    {t('admin.actions.cancel')}
                                </SecondaryButton>
                                <PrimaryButton type="submit" disabled={processing}>
                                    {action === 'approve'
                                        ? t('admin.game_approval.approve')
                                        : t('admin.game_approval.reject')}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                <div className="p-6">
                    <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/3 mb-6 md:mb-0 md:pr-6">
                            {game.image_arriere_plan ? (
                                <div className="relative">
                                    <img
                                        src={game.image_arriere_plan.startsWith('http')
                                            ? game.image_arriere_plan
                                            : `/storage/${game.image_arriere_plan}`}
                                        alt={game.titre}
                                        className="w-full h-auto rounded-lg shadow-md"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://via.placeholder.com/640x360?text=Image+Not+Available';
                                        }}
                                    />
                                </div>
                            ) : (
                                <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                                    <svg className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            )}

                            <div className="mt-4">
                                <h3 className="text-sm font-medium text-gray-500">{t('admin.game_approval.submission_date')}</h3>
                                <p className="mt-1">{formatDate(game.created_at)}</p>
                            </div>

                            <div className="mt-4">
                                <h3 className="text-sm font-medium text-gray-500">{t('admin.game_approval.developer')}</h3>
                                <p className="mt-1">{game.developpeur ? game.developpeur.name : 'Unknown'}</p>
                                <p className="text-sm text-gray-500">{game.developpeur ? game.developpeur.email : ''}</p>
                            </div>

                            {game.feedback && (
                                <div className="mt-4 p-4 bg-yellow-50 rounded-md">
                                    <h3 className="text-sm font-medium text-yellow-800">{t('admin.game_approval.feedback')}</h3>
                                    <p className="mt-1 text-sm text-yellow-700">{game.feedback}</p>
                                </div>
                            )}
                        </div>

                        <div className="md:w-2/3">
                            <h2 className="text-2xl font-bold text-gray-900">{game.titre}</h2>

                            {game.description && (
                                <div className="mt-4">
                                    <h3 className="text-sm font-medium text-gray-500">{t('game.description')}</h3>
                                    <div className="mt-2 prose prose-indigo max-w-none">
                                        <p>{game.description}</p>
                                    </div>
                                </div>
                            )}

                            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                {game.genres && game.genres.length > 0 && (
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">{t('game.genres')}</h3>
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {game.genres.map(genre => (
                                                <span key={genre.id} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                                    {genre.nom}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {game.plateformes && game.plateformes.length > 0 && (
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">{t('game.platforms')}</h3>
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {game.plateformes.map(platform => (
                                                <span key={platform.id} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    {platform.nom}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {game.tags && game.tags.length > 0 && (
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">{t('game.tags')}</h3>
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {game.tags.map(tag => (
                                                <span key={tag.id} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    {tag.nom}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {game.date_sortie && (
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">{t('game.release_date')}</h3>
                                        <p className="mt-2">{formatDate(game.date_sortie)}</p>
                                    </div>
                                )}
                            </div>

                            {/* Video preview if available */}
                            {(game.video_url || game.video_path) && (
                                <div className="mt-6">
                                    <h3 className="text-sm font-medium text-gray-500">{t('admin.game_approval.game_video')}</h3>
                                    <div className="mt-2 aspect-w-16 aspect-h-9">
                                        {game.video_url && game.video_url.includes('youtube') ? (
                                            <iframe
                                                src={game.video_url}
                                                className="w-full h-64 rounded-lg"
                                                frameBorder="0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            ></iframe>
                                        ) : game.video_path ? (
                                            <div className="relative">
                                                <video
                                                    src={`/storage/${game.video_path}`}
                                                    controls
                                                    className="w-full h-64 rounded-lg"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        // Replace with a fallback message
                                                        const parent = e.target.parentNode;
                                                        if (parent) {
                                                            const fallback = document.createElement('div');
                                                            fallback.className = 'w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center';
                                                            fallback.innerHTML = '<p class="text-gray-500">Video not available</p>';
                                                            parent.replaceChild(fallback, e.target);
                                                        }
                                                    }}
                                                />
                                            </div>
                                        ) : game.video_url ? (
                                            <div className="relative">
                                                <video
                                                    src={game.video_url}
                                                    controls
                                                    className="w-full h-64 rounded-lg"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        // Replace with a fallback message
                                                        const parent = e.target.parentNode;
                                                        if (parent) {
                                                            const fallback = document.createElement('div');
                                                            fallback.className = 'w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center';
                                                            fallback.innerHTML = '<p class="text-gray-500">Video not available</p>';
                                                            parent.replaceChild(fallback, e.target);
                                                        }
                                                    }}
                                                />
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            )}

                            {/* Approval checklist for admins */}
                            <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-sm font-medium text-gray-700 mb-3">{t('admin.game_approval.approval_checklist')}</h3>
                                <div className="space-y-3">
                                    <div className="flex items-start">
                                        <div className="flex items-center h-5">
                                            <input
                                                id="check-content"
                                                type="checkbox"
                                                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                            />
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <label htmlFor="check-content" className="font-medium text-gray-700">{t('admin.game_approval.check_content')}</label>
                                            <p className="text-gray-500">{t('admin.game_approval.check_content_desc')}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="flex items-center h-5">
                                            <input
                                                id="check-images"
                                                type="checkbox"
                                                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                            />
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <label htmlFor="check-images" className="font-medium text-gray-700">{t('admin.game_approval.check_images')}</label>
                                            <p className="text-gray-500">{t('admin.game_approval.check_images_desc')}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="flex items-center h-5">
                                            <input
                                                id="check-metadata"
                                                type="checkbox"
                                                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                            />
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <label htmlFor="check-metadata" className="font-medium text-gray-700">{t('admin.game_approval.check_metadata')}</label>
                                            <p className="text-gray-500">{t('admin.game_approval.check_metadata_desc')}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
