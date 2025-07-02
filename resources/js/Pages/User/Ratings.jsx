import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { useTranslation } from '../../lang/translationHelper';
import Pagination from '@/components/Pagination';
import { Inertia } from '@inertiajs/inertia';
import RatingsDistributionChart from '@/components/Charts/RatingsDistributionChart';
import ConfirmationModal from '@/Components/ConfirmationModal';

export default function Ratings({ auth, ratings, ratingDistribution, pagination }) {
    const { t } = useTranslation();
    const [sortBy, setSortBy] = useState('date');
    const [sortOrder, setSortOrder] = useState('desc');
    const [loading, setLoading] = useState(false);
    const [editingRating, setEditingRating] = useState(null);
    const [ratingValue, setRatingValue] = useState(0);
    const [commentValue, setCommentValue] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [ratingToDelete, setRatingToDelete] = useState(null);

    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
    };

    const sortedRatings = [...ratings].sort((a, b) => {
        if (sortBy === 'game_title') {
            return sortOrder === 'asc'
                ? a.game_title.localeCompare(b.game_title)
                : b.game_title.localeCompare(a.game_title);
        } else if (sortBy === 'rating') {
            return sortOrder === 'asc'
                ? a.rating - b.rating
                : b.rating - a.rating;
        } else if (sortBy === 'date') {
            return sortOrder === 'asc'
                ? new Date(a.created_at) - new Date(b.created_at)
                : new Date(b.created_at) - new Date(a.created_at);
        }
        return 0;
    });

    const startEditRating = (rating) => {
        setEditingRating(rating.id);
        setRatingValue(rating.rating);
        setCommentValue(rating.comment || '');
    };

    const cancelEditRating = () => {
        setEditingRating(null);
        setRatingValue(0);
        setCommentValue('');
    };

    const updateRating = (id) => {
        setLoading(true);
        Inertia.put(route('ratings.update', id), {
            rating: ratingValue,
            comment: commentValue,
        }, {
            onSuccess: () => {
                setLoading(false);
                setEditingRating(null);
            },
            onError: () => {
                setLoading(false);
                alert(t('ratings.error_updating') || 'There was an error updating your rating.');
            }
        });
    };

    const openDeleteModal = (id) => {
        setRatingToDelete(id);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setRatingToDelete(null);
    };

    const deleteRating = () => {
        if (!ratingToDelete) return;

        setLoading(true);
        Inertia.delete(route('ratings.destroy', ratingToDelete), {
            onSuccess: () => {
                setLoading(false);
                closeDeleteModal();
            },
            onError: () => {
                setLoading(false);
                alert(t('ratings.error_deleting') || 'There was an error deleting your rating.');
                closeDeleteModal();
            }
        });
    };

    const renderStars = (rating, interactive = false, onChange = null) => {
        return (
            <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type={interactive ? "button" : ""}
                        onClick={interactive ? () => onChange(star) : undefined}
                        className={interactive ? "focus:outline-none" : ""}
                        disabled={!interactive}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-5 w-5 ${star <= rating ? 'text-yellow-500' : 'text-gray-300'} ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                    </button>
                ))}
            </div>
        );
    };

    const renderRatingItem = (rating) => {
        if (editingRating === rating.id) {
            return (
                <div key={rating.id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden p-4">
                    <div className="flex flex-col sm:flex-row">
                        <div className="sm:w-1/4 h-32 sm:h-auto mb-4 sm:mb-0">
                            <Link href={route('jeux.show', rating.game_id)}>
                                <img
                                    src={rating.game_image || 'https://via.placeholder.com/300x200?text=No+Image'}
                                    alt={rating.game_title}
                                    className="w-full h-full object-cover rounded-lg"
                                />
                            </Link>
                        </div>
                        <div className="sm:w-3/4 sm:pl-6">
                            <div className="flex justify-between items-start mb-4">
                                <Link
                                    href={route('jeux.show', rating.game_id)}
                                    className="text-lg font-semibold text-gray-800 hover:text-indigo-600 transition-colors"
                                >
                                    {rating.game_title}
                                </Link>
                                <span className="text-xs text-gray-500">{rating.date}</span>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('ratings.your_rating') || 'Your Rating'}
                                </label>
                                {renderStars(ratingValue, true, setRatingValue)}
                            </div>

                            <div className="mb-4">
                                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('ratings.your_review') || 'Your Review'}
                                </label>
                                <textarea
                                    id="comment"
                                    rows="3"
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    value={commentValue}
                                    onChange={(e) => setCommentValue(e.target.value)}
                                    placeholder={t('ratings.write_review') || 'Write your review here...'}
                                ></textarea>
                            </div>

                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={cancelEditRating}
                                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    disabled={loading}
                                >
                                    {t('common.cancel') || 'Cancel'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => updateRating(rating.id)}
                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : null}
                                    {t('common.save') || 'Save'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div key={rating.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
                <div className="flex flex-col sm:flex-row">
                    <div className="sm:w-1/4 h-32 sm:h-auto">
                        <Link href={route('jeux.show', rating.game_id)}>
                            <img
                                src={rating.game_image || 'https://via.placeholder.com/300x200?text=No+Image'}
                                alt={rating.game_title}
                                className="w-full h-full object-cover"
                            />
                        </Link>
                    </div>
                    <div className="p-4 sm:w-3/4">
                        <div className="flex justify-between items-start">
                            <Link
                                href={route('jeux.show', rating.game_id)}
                                className="text-lg font-semibold text-gray-800 hover:text-indigo-600 transition-colors"
                            >
                                {rating.game_title}
                            </Link>
                            <span className="text-xs text-gray-500">{rating.date}</span>
                        </div>
                        <div className="mt-2 flex items-center">
                            {renderStars(rating.rating)}
                            <span className="ml-2 text-sm font-medium text-gray-700">{rating.rating}/5</span>
                        </div>
                        {rating.comment && (
                            <p className="mt-2 text-sm text-gray-600">{rating.comment}</p>
                        )}

                        <div className="mt-4 flex justify-end space-x-2">
                            <button
                                onClick={() => startEditRating(rating)}
                                className="text-indigo-600 hover:text-indigo-800 transition-colors"
                                disabled={loading}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </button>
                            <button
                                onClick={() => openDeleteModal(rating.id)}
                                className="text-red-500 hover:text-red-700 transition-colors"
                                disabled={loading}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <MainLayout auth={auth} currentUrl="/ratings">
            <Head title={t('ratings.page_title') || 'My Ratings'} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
                        <div className="p-6">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-2 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                                {t('ratings.page_title') || 'My Ratings'}
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                        {t('dashboard.rating_distribution') || 'Rating Distribution'}
                                    </h3>
                                    <RatingsDistributionChart ratings={ratingDistribution} />
                                </div>

                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                        {t('ratings.rating_stats') || 'Rating Statistics'}
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">{t('ratings.total_ratings') || 'Total Ratings'}</span>
                                            <span className="font-semibold text-gray-800">
                                                {Object.values(ratingDistribution).reduce((a, b) => a + b, 0)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">{t('ratings.average_rating') || 'Average Rating'}</span>
                                            <span className="font-semibold text-gray-800">
                                                {ratings.length > 0
                                                    ? (ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length).toFixed(1)
                                                    : '-'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">{t('ratings.highest_rated') || 'Highest Rated'}</span>
                                            <span className="font-semibold text-gray-800">
                                                {ratings.length > 0
                                                    ? Math.max(...ratings.map(r => r.rating))
                                                    : '-'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">{t('ratings.lowest_rated') || 'Lowest Rated'}</span>
                                            <span className="font-semibold text-gray-800">
                                                {ratings.length > 0
                                                    ? Math.min(...ratings.map(r => r.rating))
                                                    : '-'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-semibold text-gray-800">
                                    {t('ratings.your_ratings') || 'Your Ratings'}
                                </h3>
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center">
                                        <label htmlFor="sort" className="mr-2 text-sm text-gray-600">{t('ratings.sort_by') || 'Sort by'}:</label>
                                        <select
                                            id="sort"
                                            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm"
                                            value={sortBy}
                                            onChange={(e) => handleSort(e.target.value)}
                                        >
                                            <option value="date">{t('ratings.sort_date') || 'Date'}</option>
                                            <option value="game_title">{t('ratings.sort_game') || 'Game'}</option>
                                            <option value="rating">{t('ratings.sort_rating') || 'Rating'}</option>
                                        </select>
                                    </div>
                                    <button
                                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                        className="p-1 rounded-md hover:bg-gray-100 transition-colors"
                                    >
                                        {sortOrder === 'asc' ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {ratings.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                    </svg>
                                    <p className="text-gray-500 mb-4">{t('dashboard.no_ratings') || 'You haven\'t rated any games yet.'}</p>
                                    <Link
                                        href={route('jeux.index')}
                                        className="inline-flex items-center px-4 py-2 bg-yellow-500 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-yellow-600 active:bg-yellow-700 focus:outline-none focus:border-yellow-700 focus:ring ring-yellow-300 disabled:opacity-25 transition"
                                    >
                                        {t('dashboard.find_games_to_rate') || 'Find Games to Rate'}
                                    </Link>
                                </div>
                            ) : (
                                <>
                                    <div className="space-y-6">
                                        {sortedRatings.map(rating => renderRatingItem(rating))}
                                    </div>

                                    <div className="mt-8">
                                        <Pagination links={pagination} />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                show={showDeleteModal}
                title={t('ratings.delete_rating') || 'Delete Rating'}
                message={t('ratings.confirm_delete') || 'Are you sure you want to delete this rating?'}
                confirmText={t('common.delete') || 'Delete'}
                cancelText={t('common.cancel') || 'Cancel'}
                onConfirm={deleteRating}
                onCancel={closeDeleteModal}
                icon={
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-red-100 text-red-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </div>
                }
            />
        </MainLayout>
    );
}