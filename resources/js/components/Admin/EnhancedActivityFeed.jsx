import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { useTranslation } from '../../lang/translationHelper';

export default function EnhancedActivityFeed({ activities }) {
    const { t } = useTranslation();
    const [filter, setFilter] = useState('all');

    const getStatusClass = (status) => {
        switch (status) {
            case 'publie':
            case 'approved':
                return 'bg-green-100 text-green-800 border border-green-200';
            case 'en_attente':
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
            case 'rejete':
            case 'rejected':
            case 'flagged':
                return 'bg-red-100 text-red-800 border border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border border-gray-200';
        }
    };

    const getActivityIcon = (type) => {
        switch (type) {
            case 'game':
                return (
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </div>
                );
            case 'comment':
            case 'review':
                return (
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-md">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                    </div>
                );
            case 'user':
                return (
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-md">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
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

    const getActionButton = (activity) => {
        if (!activity.link) return null;

        let buttonText = t('admin.actions.view') || 'View';
        let buttonClass = 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700';

        if (activity.type === 'game') {
            if (activity.status === 'en_attente' || activity.status === 'pending') {
                buttonText = t('admin.actions.review') || 'Review';
                buttonClass = 'bg-yellow-50 hover:bg-yellow-100 text-yellow-700';
            } else if (activity.status === 'publie' || activity.status === 'approved') {
                buttonText = t('admin.actions.view_game') || 'View Game';
                buttonClass = 'bg-green-50 hover:bg-green-100 text-green-700';
            }
        } else if (activity.type === 'comment' || activity.type === 'review') {
            if (activity.status === 'pending') {
                buttonText = activity.type === 'review'
                    ? t('admin.actions.review_review') || 'Review Rating'
                    : t('admin.actions.review_comment') || 'Review Comment';
                buttonClass = 'bg-yellow-50 hover:bg-yellow-100 text-yellow-700';
            } else if (activity.status === 'flagged') {
                buttonText = t('admin.actions.moderate') || 'Moderate';
                buttonClass = 'bg-red-50 hover:bg-red-100 text-red-700';
            } else {
                buttonText = activity.type === 'review'
                    ? t('admin.actions.view_review') || 'View Rating'
                    : t('admin.actions.view_comment') || 'View Comment';
                buttonClass = 'bg-green-50 hover:bg-green-100 text-green-700';
            }
        } else if (activity.type === 'user') {
            buttonText = t('admin.actions.manage_user') || 'Manage User';
            buttonClass = 'bg-purple-50 hover:bg-purple-100 text-purple-700';
        }

        return (
            <Link
                href={activity.link}
                className={`inline-flex items-center justify-center px-4 py-2 sm:py-1.5 ${buttonClass} text-sm font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow min-h-[40px] sm:min-h-0 w-full sm:w-auto`}
            >
                {buttonText}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </Link>
        );
    };

    const filteredActivities = filter === 'all'
        ? activities
        : filter === 'comment'
            // Include both comments and reviews when filtering for comments
            ? activities.filter(activity => activity.type === 'comment' || activity.type === 'review')
            : activities.filter(activity => activity.type === filter);

    return (
        <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100">
            <div className="p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {t('admin.dashboard.recent_activity') || 'Recent Activity'}
                    </h3>
                    <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-start sm:justify-end">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-3 py-2 sm:py-1.5 text-sm rounded-lg font-medium transition-colors duration-200 min-w-[60px] min-h-[40px] sm:min-h-0 ${
                                filter === 'all'
                                    ? 'bg-indigo-600 text-white shadow-sm'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            {t('admin.dashboard.all') || 'All'}
                        </button>
                        <button
                            onClick={() => setFilter('game')}
                            className={`px-3 py-2 sm:py-1.5 text-sm rounded-lg font-medium transition-colors duration-200 min-w-[60px] min-h-[40px] sm:min-h-0 ${
                                filter === 'game'
                                    ? 'bg-blue-600 text-white shadow-sm'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            {t('admin.dashboard.games') || 'Games'}
                        </button>
                        <button
                            onClick={() => setFilter('comment')}
                            className={`px-3 py-2 sm:py-1.5 text-sm rounded-lg font-medium transition-colors duration-200 min-w-[60px] min-h-[40px] sm:min-h-0 ${
                                filter === 'comment'
                                    ? 'bg-green-600 text-white shadow-sm'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            {t('admin.dashboard.comments') || 'Comments'}
                        </button>
                        <button
                            onClick={() => setFilter('user')}
                            className={`px-3 py-2 sm:py-1.5 text-sm rounded-lg font-medium transition-colors duration-200 min-w-[60px] min-h-[40px] sm:min-h-0 ${
                                filter === 'user'
                                    ? 'bg-purple-600 text-white shadow-sm'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            {t('admin.dashboard.users') || 'Users'}
                        </button>
                    </div>
                </div>

                <div className="space-y-6">
                    {filteredActivities.length > 0 ? (
                        filteredActivities.map((activity, index) => (
                            <div key={index} className="flex flex-col sm:flex-row items-start p-4 sm:p-5 rounded-xl border border-gray-100 hover:border-gray-300 hover:shadow-md transition-all duration-300 bg-white">
                                <div className="flex items-center sm:items-start w-full sm:w-auto mb-3 sm:mb-0">
                                    {getActivityIcon(activity.type)}
                                    <div className="ml-3 sm:hidden flex-1">
                                        <div className="text-base font-semibold text-gray-900 line-clamp-1">
                                            {activity.type === 'game' && activity.title}
                                            {(activity.type === 'comment' || activity.type === 'review') && (
                                                <>
                                                    <span className="font-semibold">{activity.user}</span>
                                                    <span className="mx-1 text-gray-500">on</span>
                                                    <span>{activity.game}</span>
                                                </>
                                            )}
                                            {activity.type === 'user' && activity.name}
                                        </div>
                                        <div className="text-xs text-gray-500">{activity.date}</div>
                                        {(activity.type === 'comment' || activity.type === 'review') && (
                                            <div className="mt-1 text-sm text-gray-600 line-clamp-2 italic">
                                                {activity.type === 'review' && activity.rating && (
                                                    <span className="font-medium text-amber-600 mr-1">[{activity.rating}/5]</span>
                                                )}
                                                "{activity.content || t('admin.comment_moderation.no_content')}"
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="sm:ml-4 flex-1 w-full">
                                    <div className="hidden sm:flex sm:flex-row sm:items-center sm:justify-between">
                                        <div className="text-base font-semibold text-gray-900">
                                            {activity.type === 'game' && activity.title}
                                            {(activity.type === 'comment' || activity.type === 'review') && (
                                                <>
                                                    <span className="font-semibold">{activity.user}</span>
                                                    <span className="mx-1 text-gray-500">on</span>
                                                    <span>{activity.game}</span>
                                                </>
                                            )}
                                            {activity.type === 'user' && activity.name}
                                        </div>
                                        <div className="text-sm text-gray-500">{activity.date}</div>
                                    </div>
                                    <div className="mt-2">
                                        {activity.type === 'game' && (
                                            <div className="text-sm text-gray-600">
                                                {t('admin.game_approval.developer')}: <span className="font-medium">{activity.user}</span>
                                            </div>
                                        )}
                                        {(activity.type === 'comment' || activity.type === 'review') && (
                                            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100 mt-2">
                                                <div className="flex items-start">
                                                    <div className="flex-shrink-0 mr-2 mt-1">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                                        </svg>
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="font-medium text-gray-700 mb-1 flex flex-wrap items-center gap-2">
                                                            <span>
                                                                {activity.type === 'review'
                                                                    ? t('admin.review_moderation.review_content') || 'Review Content'
                                                                    : t('admin.comment_moderation.comment_content') || 'Comment Content'}:
                                                            </span>
                                                            {activity.user_email && (
                                                                <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded">
                                                                    {activity.user_email}
                                                                </span>
                                                            )}
                                                            {activity.type === 'review' && activity.rating && (
                                                                <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded flex items-center">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-0.5" fill="currentColor" viewBox="0 0 24 24">
                                                                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                                                    </svg>
                                                                    {activity.rating}/5
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="italic">
                                                            "{activity.content || t('admin.comment_moderation.no_content')}"
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        {activity.type === 'user' && (
                                            <div className="text-sm text-gray-600">
                                                <div>
                                                    <span className="text-gray-500">{t('admin.user_management.email')}: </span>
                                                    <span className="font-medium break-all">{activity.email}</span>
                                                </div>
                                                {activity.role && (
                                                    <div className="mt-1">
                                                        <span className="text-gray-500">{t('admin.user_management.role')}: </span>
                                                        <span className="font-medium">{activity.role}</span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                        {activity.type === 'comment' || activity.type === 'review' ? (
                                            <div className="flex items-center">
                                                <span className={`inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium ${getStatusClass(activity.status)}`}>
                                                    {activity.status === 'pending'
                                                        ? (
                                                            <>
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>
                                                                {activity.type === 'review'
                                                                    ? t('admin.review_moderation.needs_review') || 'Needs Review'
                                                                    : t('admin.comment_moderation.needs_review') || 'Needs Review'}
                                                            </>
                                                        )
                                                        : activity.status === 'approved'
                                                            ? (
                                                                <>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                    </svg>
                                                                    {activity.type === 'review'
                                                                        ? t('admin.review_moderation.approved') || 'Approved'
                                                                        : t('admin.comment_moderation.approved') || 'Approved'}
                                                                </>
                                                            )
                                                            : activity.status === 'flagged'
                                                                ? (
                                                                    <>
                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                                        </svg>
                                                                        {activity.type === 'review'
                                                                            ? t('admin.review_moderation.flagged') || 'Flagged'
                                                                            : t('admin.comment_moderation.flagged') || 'Flagged'}
                                                                    </>
                                                                )
                                                                : activity.status
                                                    }
                                                </span>
                                            </div>
                                        ) : (
                                            <span className={`inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium ${getStatusClass(activity.status)}`}>
                                                {activity.status === 'en_attente' || activity.status === 'pending'
                                                    ? t('developer.dashboard.pending_approval')
                                                    : activity.status === 'publie' || activity.status === 'approved'
                                                        ? t('developer.dashboard.published')
                                                        : activity.status === 'rejete' || activity.status === 'rejected'
                                                            ? t('developer.dashboard.rejected')
                                                            : activity.status === 'flagged'
                                                                ? t('admin.comment_moderation.flagged')
                                                                : activity.status
                                                }
                                            </span>
                                        )}

                                        {getActionButton(activity)}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-gray-50 rounded-xl p-6 sm:p-8 text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-gray-400 mb-3 sm:mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                            <p className="text-gray-600 font-medium">{t('admin.messages.no_data') || 'No activity found'}</p>
                            <p className="text-gray-500 text-sm mt-1">{t('admin.messages.check_back') || 'Check back later for updates'}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
