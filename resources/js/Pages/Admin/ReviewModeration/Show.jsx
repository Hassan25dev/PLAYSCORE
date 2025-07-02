import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { useTranslation } from '../../../lang/translationHelper';
import TextArea from '../../../Components/TextArea';
import InputError from '../../../Components/InputError';
import PrimaryButton from '../../../Components/PrimaryButton';
import SecondaryButton from '../../../Components/SecondaryButton';
import DangerButton from '../../../Components/DangerButton';

export default function ReviewModerationShow({ auth, review }) {
    const { t } = useTranslation();
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const { data, setData, post, put, processing, reset, errors } = useForm({
        action: '',
        reason: '',
    });

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString() + ' ' + new Date(dateString).toLocaleTimeString();
    };

    const handleApprove = () => {
        setData('action', 'approve');
        put(route('admin.review-moderation.update', {id: review.id}), {
            onSuccess: () => reset(),
        });
    };

    const handleReject = (e) => {
        e.preventDefault();
        setData('action', 'reject');
        put(route('admin.review-moderation.update', {id: review.id}), {
            onSuccess: () => {
                reset();
                setShowRejectModal(false);
            },
        });
    };

    const handleDelete = () => {
        post(route('admin.review-moderation.destroy', {id: review.id}), {
            method: 'delete',
            onSuccess: () => {
                setShowDeleteModal(false);
            },
        });
    };

    return (
        <AdminLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{t('admin.review_moderation.view_review')}</h2>}
        >
            <Head title={t('admin.review_moderation.view_review')} />

            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                <div className="p-6 flex justify-between items-center">
                    <div>
                        <Link
                            href={route('admin.review-moderation.index')}
                            className="text-indigo-600 hover:text-indigo-900"
                        >
                            ← {t('admin.actions.back')}
                        </Link>
                    </div>
                    <div className="flex space-x-2">
                        {!review.is_approved && (
                            <PrimaryButton
                                onClick={handleApprove}
                                className="ml-4"
                                disabled={processing}
                            >
                                {t('admin.actions.approve')}
                            </PrimaryButton>
                        )}
                        {!review.is_approved && (
                            <SecondaryButton
                                onClick={() => setShowRejectModal(true)}
                                className="ml-4"
                                disabled={processing}
                            >
                                {t('admin.actions.reject')}
                            </SecondaryButton>
                        )}
                        <DangerButton
                            onClick={() => setShowDeleteModal(true)}
                            className="ml-4"
                            disabled={processing}
                        >
                            {t('admin.actions.delete')}
                        </DangerButton>
                    </div>
                </div>

                <div className="p-6">
                    <div className="mb-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">{t('admin.review_moderation.review_details')}</h3>

                        <div className="bg-gray-50 p-4 rounded-md mb-4">
                            <div className="flex justify-between mb-2">
                                <div className="font-medium text-gray-700">
                                    {review.utilisateur ? review.utilisateur.name : 'Unknown'}
                                    <span className="text-gray-500 text-sm ml-2">
                                        {formatDate(review.created_at)}
                                    </span>
                                </div>
                                <div>
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                        review.is_approved
                                            ? 'bg-green-100 text-green-800'
                                            : review.is_flagged
                                                ? 'bg-red-100 text-red-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {review.is_approved
                                            ? t('admin.review_moderation.status_approved')
                                            : review.is_flagged
                                                ? t('admin.review_moderation.status_flagged')
                                                : t('admin.review_moderation.status_pending')
                                        }
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center mb-2">
                                <div className="text-lg font-medium mr-2">{t('admin.review_moderation.rating')}:</div>
                                <div className="flex">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <svg
                                            key={star}
                                            className={`w-5 h-5 ${star <= review.note ? 'text-yellow-400' : 'text-gray-300'}`}
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                            </div>
                            <div className="text-gray-700 whitespace-pre-wrap">
                                {review.commentaire}
                            </div>
                        </div>

                        {review.flag_reason && (
                            <div className="bg-red-50 p-4 rounded-md mb-4">
                                <h4 className="font-medium text-red-800 mb-1">{t('admin.review_moderation.flag_reason')}</h4>
                                <div className="text-red-700">
                                    {review.flag_reason}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mb-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">{t('admin.review_moderation.game_info')}</h3>

                        <div className="bg-gray-50 p-4 rounded-md">
                            <div className="flex items-center">
                                {review.jeu && review.jeu.image_arriere_plan ? (
                                    <img
                                        src={review.jeu.image_arriere_plan.startsWith('http')
                                            ? review.jeu.image_arriere_plan
                                            : review.jeu.image_arriere_plan.includes('/storage/')
                                                ? review.jeu.image_arriere_plan
                                                : `/storage/${review.jeu.image_arriere_plan}`}
                                        alt={review.jeu.titre}
                                        className="w-16 h-16 object-cover rounded mr-4"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = '/images/placeholder-game.png';
                                        }}
                                    />
                                ) : (
                                    <div className="w-16 h-16 bg-gray-200 rounded mr-4 flex items-center justify-center">
                                        <span className="text-gray-500 text-xs">No image</span>
                                    </div>
                                )}
                                <div>
                                    <h4 className="font-medium text-gray-900">
                                        {review.jeu ? review.jeu.titre : 'Unknown Game'}
                                    </h4>
                                    {review.jeu && (
                                        <Link
                                            href={route('jeux.show', review.jeu.id)}
                                            className="text-sm text-indigo-600 hover:text-indigo-900"
                                            target="_blank"
                                        >
                                            {t('admin.actions.view_game')}
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reject Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg overflow-hidden shadow-xl max-w-lg w-full">
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                {t('admin.review_moderation.reject_review')}
                            </h3>
                            <form onSubmit={handleReject}>
                                <div className="mb-4">
                                    <TextArea
                                        id="reason"
                                        name="reason"
                                        value={data.reason}
                                        onChange={(e) => setData('reason', e.target.value)}
                                        label={t('admin.review_moderation.rejection_reason')}
                                        placeholder={t('admin.review_moderation.rejection_reason_placeholder')}
                                        rows={4}
                                    />
                                    <InputError message={errors.reason} className="mt-2" />
                                </div>
                                <div className="flex justify-end space-x-2">
                                    <SecondaryButton
                                        type="button"
                                        onClick={() => setShowRejectModal(false)}
                                    >
                                        {t('admin.actions.cancel')}
                                    </SecondaryButton>
                                    <PrimaryButton
                                        type="submit"
                                        disabled={processing}
                                    >
                                        {t('admin.actions.reject')}
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg overflow-hidden shadow-xl max-w-lg w-full">
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                {t('admin.review_moderation.delete_review')}
                            </h3>
                            <p className="mb-4 text-gray-600">
                                {t('admin.review_moderation.delete_confirmation')}
                            </p>
                            <div className="flex justify-end space-x-2">
                                <SecondaryButton
                                    type="button"
                                    onClick={() => setShowDeleteModal(false)}
                                >
                                    {t('admin.actions.cancel')}
                                </SecondaryButton>
                                <DangerButton
                                    type="button"
                                    onClick={handleDelete}
                                    disabled={processing}
                                >
                                    {t('admin.actions.delete')}
                                </DangerButton>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
