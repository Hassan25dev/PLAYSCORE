import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { useTranslation } from '../../../lang/translationHelper';
import Pagination from '../../../Components/Pagination';

export default function ReviewModerationIndex({ auth, pendingReviews, counts }) {
    const { t, locale } = useTranslation();

    // Force re-render when locale changes
    const [currentLocale, setCurrentLocale] = useState(locale);

    useEffect(() => {
        if (locale !== currentLocale) {
            setCurrentLocale(locale);
        }
    }, [locale, currentLocale]);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString();
    };

    const truncateText = (text, maxLength = 100) => {
        if (!text) return '';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    return (
        <AdminLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{t('admin.review_moderation.pending_reviews')}</h2>}
        >
            <Head title={t('admin.review_moderation.pending_reviews')} />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6">
                        <div className="text-sm font-medium text-gray-500">{t('admin.review_moderation.pending')}</div>
                        <div className="text-2xl font-semibold">{counts.pending}</div>
                        <Link
                            href={route('admin.review-moderation.index')}
                            className={`mt-2 inline-block text-sm font-medium ${route().current('admin.review-moderation.index') ? 'text-indigo-800' : 'text-indigo-600 hover:text-indigo-800'}`}
                        >
                            {t('admin.actions.view')}
                        </Link>
                    </div>
                </div>
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6">
                        <div className="text-sm font-medium text-gray-500">{t('admin.review_moderation.approved')}</div>
                        <div className="text-2xl font-semibold">{counts.approved}</div>
                        <Link
                            href={route('admin.review-moderation.approved')}
                            className={`mt-2 inline-block text-sm font-medium ${route().current('admin.review-moderation.approved') ? 'text-indigo-800' : 'text-indigo-600 hover:text-indigo-800'}`}
                        >
                            {t('admin.actions.view')}
                        </Link>
                    </div>
                </div>
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6">
                        <div className="text-sm font-medium text-gray-500">{t('admin.review_moderation.flagged')}</div>
                        <div className="text-2xl font-semibold">{counts.flagged}</div>
                        <Link
                            href={route('admin.review-moderation.flagged')}
                            className={`mt-2 inline-block text-sm font-medium ${route().current('admin.review-moderation.flagged') ? 'text-indigo-800' : 'text-indigo-600 hover:text-indigo-800'}`}
                        >
                            {t('admin.actions.view')}
                        </Link>
                    </div>
                </div>
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6">
                        <div className="text-sm font-medium text-gray-500">{t('admin.review_moderation.total')}</div>
                        <div className="text-2xl font-semibold">{counts.total}</div>
                    </div>
                </div>
            </div>

            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                <div className="p-6 flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="mb-4 md:mb-0">
                        <h3 className="text-lg font-medium text-gray-900">{t('admin.review_moderation.pending_reviews')}</h3>
                        <p className="mt-1 text-sm text-gray-600">
                            {t('admin.review_moderation.pending_description')}
                        </p>
                    </div>
                    <div>
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 flex items-center justify-center"
                            title={t('admin.actions.refresh')}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            {t('admin.actions.refresh')}
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div className="p-6">

                    {pendingReviews.data.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            {t('admin.review_moderation.user')}
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            {t('admin.review_moderation.game')}
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            {t('admin.review_moderation.rating')}
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            {t('admin.review_moderation.comment')}
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            {t('admin.review_moderation.date')}
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            {t('admin.actions.actions')}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {pendingReviews.data.map((review) => (
                                        <tr key={review.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {review.utilisateur ? review.utilisateur.name : 'Unknown'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {review.jeu ? review.jeu.titre : 'Unknown Game'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
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
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900">
                                                    {truncateText(review.commentaire)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-500">
                                                    {formatDate(review.created_at)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <Link
                                                    href={route('admin.review-moderation.show', {id: review.id})}
                                                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                                                >
                                                    {t('admin.actions.view')}
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-yellow-700">
                                        {t('admin.review_moderation.no_pending_reviews')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mt-6">
                        <Pagination links={pendingReviews.links} />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
