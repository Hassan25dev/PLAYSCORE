import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { useTranslation } from '../../lang/translationHelper';

export default function EnhancedActivityFeed({ activities }) {
    const { t } = useTranslation();
    const [filter, setFilter] = useState('all');

    const getActivityIcon = (type) => {
        switch (type) {
            case 'game':
                return (
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                        </svg>
                    </div>
                );
            case 'comment':
                return (
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-md">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                    </div>
                );
            case 'rating':
                return (
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center shadow-md">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                    </div>
                );
            case 'review':
                return (
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-md">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                    </div>
                );
            default:
                return (
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center shadow-md">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                );
        }
    };

    const getActivityStatusBadge = (activity) => {
        // Handle explicit status field first (for comments and ratings)
        if (activity.status) {
            switch (activity.status) {
                case 'approved':
                    return (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {t('developer.status.approved')}
                        </span>
                    );
                case 'pending':
                    return (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            {t('developer.status.pending')}
                        </span>
                    );
                case 'flagged':
                    return (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            {t('developer.status.flagged')}
                        </span>
                    );
                case 'publie':
                    return (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {t('developer.status.approved')}
                        </span>
                    );
                case 'en_attente':
                    return (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            {t('developer.status.pending')}
                        </span>
                    );
                case 'rejete':
                    return (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            {t('developer.status.rejected')}
                        </span>
                    );
                case 'brouillon':
                    return (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {t('developer.status.draft')}
                        </span>
                    );
            }
        }

        // Fallback to description-based status for backward compatibility
        if (activity.description) {
            if (activity.description.includes('approved')) {
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {t('developer.status.approved')}
                    </span>
                );
            } else if (activity.description.includes('rejected')) {
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {t('developer.status.rejected')}
                    </span>
                );
            } else if (activity.description.includes('submitted')) {
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        {t('developer.status.pending')}
                    </span>
                );
            } else if (activity.description.includes('draft')) {
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {t('developer.status.draft')}
                    </span>
                );
            }
        }

        return null;
    };

    const filteredActivities = filter === 'all'
        ? activities
        : filter === 'pending'
            ? activities.filter(activity => activity.status === 'pending' || activity.status === 'en_attente' || (activity.description && activity.description.includes('submitted')))
            : filter === 'reviews'
                ? activities.filter(activity => activity.type === 'review')
                : activities.filter(activity => activity.type === filter);

    return (
        <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100">
            <div className="p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {t('developer.dashboard.recent_activity')}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors duration-200 ${
                                filter === 'all'
                                    ? 'bg-teal-600 text-white shadow-sm'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            {t('developer.dashboard.all') || 'All'}
                        </button>
                        <button
                            onClick={() => setFilter('pending')}
                            className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors duration-200 ${
                                filter === 'pending'
                                    ? 'bg-orange-600 text-white shadow-sm'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            {t('developer.dashboard.pending') || 'Pending'}
                        </button>
                        <button
                            onClick={() => setFilter('game')}
                            className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors duration-200 ${
                                filter === 'game'
                                    ? 'bg-blue-600 text-white shadow-sm'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            {t('developer.dashboard.games') || 'Games'}
                        </button>

                        <button
                            onClick={() => setFilter('rating')}
                            className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors duration-200 ${
                                filter === 'rating'
                                    ? 'bg-yellow-600 text-white shadow-sm'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            {t('developer.dashboard.ratings') || 'Ratings'}
                        </button>
                        <button
                            onClick={() => setFilter('reviews')}
                            className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors duration-200 ${
                                filter === 'reviews'
                                    ? 'bg-purple-600 text-white shadow-sm'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            {t('developer.dashboard.reviews') || 'Reviews'}
                        </button>
                    </div>
                </div>

                <div className="space-y-6">
                    {filteredActivities.length > 0 ? (
                        filteredActivities.map((activity, index) => (
                            <div key={index} className="flex items-start p-4 rounded-xl border border-gray-100 hover:border-gray-300 hover:shadow-md transition-all duration-300 bg-white">
                                {getActivityIcon(activity.type)}
                                <div className="ml-4 flex-1">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="text-base font-semibold text-gray-900">
                                                {activity.title}
                                            </div>
                                            {getActivityStatusBadge(activity)}
                                        </div>
                                        <div className="text-sm text-gray-500 mt-1 sm:mt-0">{activity.date}</div>
                                    </div>
                                    <div className="mt-2">
                                        <div className="text-sm text-gray-600">
                                            {activity.description}
                                        </div>

                                        {/* Display rating for both ratings and reviews */}
                                        {(activity.rating || activity.type === 'review' || activity.type === 'rating') && (
                                            <div className="mt-2 flex items-center">
                                                <span className="text-sm font-medium text-gray-700 mr-2">Rating:</span>
                                                <div className="flex items-center">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <svg
                                                            key={star}
                                                            className={`w-4 h-4 ${star <= activity.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                                                            fill="currentColor"
                                                            viewBox="0 0 20 20"
                                                        >
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Display content for comments and reviews */}
                                        {activity.content && (
                                            <div className="mt-2 p-3 bg-gray-50 rounded-lg text-sm text-gray-700 italic">
                                                "{activity.content}"
                                            </div>
                                        )}

                                        {/* Display user and game info for reviews */}
                                        {activity.type === 'review' && activity.user && activity.game && (
                                            <div className="mt-2 text-xs text-gray-500">
                                                <span className="font-medium">{activity.user}</span> on <span className="font-medium">{activity.game}</span>
                                            </div>
                                        )}
                                    </div>
                                    {activity.link && (
                                        <div className="mt-3">
                                            <Link
                                                href={activity.link}
                                                className="inline-flex items-center px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 text-sm font-medium rounded-lg transition-colors duration-200"
                                            >
                                                {t('developer.actions.view') || 'View Details'}
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-gray-50 rounded-xl p-8 text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                            <p className="text-gray-600 font-medium">{t('developer.messages.no_activity') || 'No activity found'}</p>
                            <p className="text-gray-500 text-sm mt-1">{t('developer.messages.check_back') || 'Check back later for updates'}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
