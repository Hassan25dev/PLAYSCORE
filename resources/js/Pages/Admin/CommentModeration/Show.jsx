import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { useTranslation } from '../../../lang/translationHelper';
import TextArea from '../../../Components/TextArea';
import InputError from '../../../Components/InputError';
import PrimaryButton from '../../../Components/PrimaryButton';
import SecondaryButton from '../../../Components/SecondaryButton';
import DangerButton from '../../../Components/DangerButton';

export default function CommentModerationShow({ auth, comment }) {
    const { t } = useTranslation();
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const { data, setData, post, put, delete: delete_, processing, reset, errors } = useForm({
        action: '',
        reason: '',
    });

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString() + ' ' + new Date(dateString).toLocaleTimeString();
    };

    const handleApprove = () => {
        setData('action', 'approve');
        put(route('admin.comment-moderation.update', comment.id), {
            onSuccess: () => reset(),
        });
    };

    const handleReject = (e) => {
        e.preventDefault();
        setData('action', 'reject');
        put(route('admin.comment-moderation.update', comment.id), {
            onSuccess: () => {
                reset();
                setShowRejectModal(false);
            },
        });
    };

    const handleDelete = () => {
        delete_(route('admin.comment-moderation.destroy', comment.id), {
            onSuccess: () => {
                setShowDeleteModal(false);
            },
        });
    };

    return (
        <AdminLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{t('admin.comment_moderation.view_comment')}</h2>}
        >
            <Head title={t('admin.comment_moderation.view_comment')} />

            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                <div className="p-6 flex justify-between items-center">
                    <div>
                        <Link
                            href={route('admin.comment-moderation.index')}
                            className="text-indigo-600 hover:text-indigo-900"
                        >
                            ← {t('admin.actions.back')}
                        </Link>
                    </div>
                    <div className="flex space-x-2">
                        {!comment.is_approved && (
                            <PrimaryButton
                                onClick={handleApprove}
                                className="ml-4"
                                disabled={processing}
                            >
                                {t('admin.actions.approve')}
                            </PrimaryButton>
                        )}
                        {!comment.is_approved && (
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
            </div>

            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                <div className="p-6">
                    <div className="mb-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">{t('admin.comment_moderation.comment_details')}</h3>

                        <div className="bg-gray-50 p-4 rounded-md mb-4">
                            <div className="flex justify-between mb-2">
                                <div className="font-medium text-gray-700">
                                    {comment.user ? comment.user.name : 'Unknown'}
                                    <span className="text-gray-500 text-sm ml-2">
                                        {formatDate(comment.created_at)}
                                    </span>
                                </div>
                                <div>
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                        comment.is_approved
                                            ? 'bg-green-100 text-green-800'
                                            : comment.is_flagged
                                                ? 'bg-red-100 text-red-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {comment.is_approved
                                            ? t('admin.comment_moderation.status_approved')
                                            : comment.is_flagged
                                                ? t('admin.comment_moderation.status_flagged')
                                                : t('admin.comment_moderation.status_pending')
                                        }
                                    </span>
                                </div>
                            </div>
                            <div className="text-gray-700 whitespace-pre-wrap">
                                {comment.content}
                            </div>
                        </div>

                        {comment.flag_reason && (
                            <div className="bg-red-50 p-4 rounded-md mb-4">
                                <h4 className="font-medium text-red-800 mb-1">{t('admin.comment_moderation.flag_reason')}</h4>
                                <div className="text-red-700">
                                    {comment.flag_reason}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mb-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">{t('admin.comment_moderation.game_info')}</h3>

                        <div className="bg-gray-50 p-4 rounded-md">
                            <div className="flex items-center">
                                {comment.jeu && comment.jeu.image_arriere_plan ? (
                                    <img
                                        src={comment.jeu.image_arriere_plan.startsWith('http')
                                            ? comment.jeu.image_arriere_plan
                                            : comment.jeu.image_arriere_plan.includes('/storage/')
                                                ? comment.jeu.image_arriere_plan
                                                : `/storage/${comment.jeu.image_arriere_plan}`}
                                        alt={comment.jeu.titre}
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
                                        {comment.jeu ? comment.jeu.titre : 'Unknown Game'}
                                    </h4>
                                    {comment.jeu && (
                                        <Link
                                            href={route('jeux.show', comment.jeu.id)}
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

                    {comment.parent && (
                        <div className="mb-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">{t('admin.comment_moderation.parent_comment')}</h3>

                            <div className="bg-gray-50 p-4 rounded-md">
                                <div className="flex justify-between mb-2">
                                    <div className="font-medium text-gray-700">
                                        {comment.parent.user ? comment.parent.user.name : 'Unknown'}
                                        <span className="text-gray-500 text-sm ml-2">
                                            {formatDate(comment.parent.created_at)}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-gray-700 whitespace-pre-wrap">
                                    {comment.parent.content}
                                </div>
                            </div>
                        </div>
                    )}

                    {comment.replies && comment.replies.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">{t('admin.comment_moderation.replies')}</h3>

                            <div className="space-y-4">
                                {comment.replies.map(reply => (
                                    <div key={reply.id} className="bg-gray-50 p-4 rounded-md">
                                        <div className="flex justify-between mb-2">
                                            <div className="font-medium text-gray-700">
                                                {reply.user ? reply.user.name : 'Unknown'}
                                                <span className="text-gray-500 text-sm ml-2">
                                                    {formatDate(reply.created_at)}
                                                </span>
                                            </div>
                                            <div>
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                    reply.is_approved
                                                        ? 'bg-green-100 text-green-800'
                                                        : reply.is_flagged
                                                            ? 'bg-red-100 text-red-800'
                                                            : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {reply.is_approved
                                                        ? t('admin.comment_moderation.status_approved')
                                                        : reply.is_flagged
                                                            ? t('admin.comment_moderation.status_flagged')
                                                            : t('admin.comment_moderation.status_pending')
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-gray-700 whitespace-pre-wrap">
                                            {reply.content}
                                        </div>
                                        <div className="mt-2">
                                            <Link
                                                href={route('admin.comment-moderation.show', reply.id)}
                                                className="text-sm text-indigo-600 hover:text-indigo-900"
                                            >
                                                {t('admin.actions.view')}
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Reject Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg overflow-hidden shadow-xl max-w-lg w-full">
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                {t('admin.comment_moderation.reject_comment')}
                            </h3>

                            <form onSubmit={handleReject}>
                                <div className="mb-4">
                                    <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                                        {t('admin.comment_moderation.rejection_reason')}
                                    </label>
                                    <TextArea
                                        id="reason"
                                        value={data.reason}
                                        onChange={(e) => setData('reason', e.target.value)}
                                        rows={4}
                                        className="w-full"
                                    />
                                    <InputError message={errors.reason} className="mt-2" />
                                </div>

                                <div className="flex justify-end space-x-3">
                                    <SecondaryButton type="button" onClick={() => setShowRejectModal(false)}>
                                        {t('admin.actions.cancel')}
                                    </SecondaryButton>
                                    <PrimaryButton type="submit" disabled={processing}>
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
                                {t('admin.comment_moderation.delete_comment')}
                            </h3>

                            <p className="mb-4 text-gray-700">
                                {t('admin.comment_moderation.delete_confirmation')}
                            </p>

                            <div className="flex justify-end space-x-3">
                                <SecondaryButton type="button" onClick={() => setShowDeleteModal(false)}>
                                    {t('admin.actions.cancel')}
                                </SecondaryButton>
                                <DangerButton type="button" onClick={handleDelete} disabled={processing}>
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
