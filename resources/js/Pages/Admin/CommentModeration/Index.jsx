import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { useTranslation } from '../../../lang/translationHelper';
import Pagination from '../../../Components/Pagination';

export default function CommentModerationIndex({ auth, pendingComments, counts }) {
    const { t, locale } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');

    // Force re-render when locale changes
    const [currentLocale, setCurrentLocale] = useState(locale);

    useEffect(() => {
        if (locale !== currentLocale) {
            setCurrentLocale(locale);
        }
    }, [locale, currentLocale]);

    // Check if pendingComments has the expected structure
    const hasData = pendingComments && pendingComments.data;

    // Use empty array as fallback if data is not available
    const commentsData = hasData ? pendingComments.data : [];

    // Filter comments based on search term
    const filteredComments = commentsData.filter(comment =>
        (comment.content && comment.content.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (comment.user && comment.user.name && comment.user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (comment.jeu && comment.jeu.titre && comment.jeu.titre.toLowerCase().includes(searchTerm.toLowerCase()))
    );

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
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{t('admin.comment_moderation.title')}</h2>}
        >
            <Head title={t('admin.comment_moderation.title')} />

            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                <div className="p-6 flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="mb-4 md:mb-0">
                        <h3 className="text-lg font-medium text-gray-900">{t('admin.comment_moderation.pending_comments')}</h3>
                        <p className="mt-1 text-sm text-gray-600">
                            {t('admin.comment_moderation.pending_description')}
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div>
                            <input
                                type="text"
                                placeholder={t('admin.actions.search')}
                                className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm w-full"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div>
                            <button
                                onClick={() => window.location.reload()}
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 flex items-center justify-center"
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6">
                        <div className="text-sm font-medium text-gray-500">{t('admin.comment_moderation.pending')}</div>
                        <div className="text-2xl font-semibold">{counts.pending}</div>
                        <Link
                            href={route('admin.comment-moderation.index')}
                            className={`mt-2 inline-block text-sm font-medium ${route().current('admin.comment-moderation.index') ? 'text-indigo-800' : 'text-indigo-600 hover:text-indigo-800'}`}
                        >
                            {t('admin.actions.view')}
                        </Link>
                    </div>
                </div>
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6">
                        <div className="text-sm font-medium text-gray-500">{t('admin.comment_moderation.approved')}</div>
                        <div className="text-2xl font-semibold">{counts.approved}</div>
                        <Link
                            href={route('admin.comment-moderation.approved')}
                            className={`mt-2 inline-block text-sm font-medium ${route().current('admin.comment-moderation.approved') ? 'text-indigo-800' : 'text-indigo-600 hover:text-indigo-800'}`}
                        >
                            {t('admin.actions.view')}
                        </Link>
                    </div>
                </div>
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6">
                        <div className="text-sm font-medium text-gray-500">{t('admin.comment_moderation.flagged')}</div>
                        <div className="text-2xl font-semibold">{counts.flagged}</div>
                        <Link
                            href={route('admin.comment-moderation.flagged')}
                            className={`mt-2 inline-block text-sm font-medium ${route().current('admin.comment-moderation.flagged') ? 'text-indigo-800' : 'text-indigo-600 hover:text-indigo-800'}`}
                        >
                            {t('admin.actions.view')}
                        </Link>
                    </div>
                </div>
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6">
                        <div className="text-sm font-medium text-gray-500">{t('admin.comment_moderation.total')}</div>
                        <div className="text-2xl font-semibold">{counts.total}</div>
                    </div>
                </div>
            </div>

            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div className="p-6">
                    {filteredComments.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            {t('admin.comment_moderation.content')}
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            {t('admin.comment_moderation.user')}
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            {t('admin.comment_moderation.game')}
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            {t('admin.comment_moderation.date')}
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            {t('admin.actions.title')}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredComments.map((comment) => (
                                        <tr key={comment.id}>
                                            <td className="px-6 py-4 whitespace-normal">
                                                <div className="text-sm text-gray-900">
                                                    {truncateText(comment.content)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {comment.user ? comment.user.name : 'Unknown'}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {comment.user ? comment.user.email : ''}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {comment.jeu ? comment.jeu.titre : 'Unknown'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {formatDate(comment.created_at)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <Link
                                                    href={route('admin.comment-moderation.show', comment.id)}
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
                        <div className="text-center py-4">
                            <p className="text-gray-500">{t('admin.comment_moderation.no_pending_comments')}</p>
                        </div>
                    )}

                    <div className="mt-6">
                        {pendingComments && pendingComments.links && (
                            <Pagination links={pendingComments.links} />
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
