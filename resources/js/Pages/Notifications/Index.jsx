import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import NotificationLayout from '../../Layouts/NotificationLayout';
import { useTranslation } from '../../lang/translationHelper';
import axios from 'axios';

export default function NotificationsIndex({ auth, notifications }) {
    const { t } = useTranslation();
    const [notificationTypes, setNotificationTypes] = useState({});

    // Determine notification types based on user role
    useEffect(() => {
        const userRole = auth.user.role;

        // Define notification types based on user role
        const baseTypes = {};

        if (userRole === 'admin') {
            setNotificationTypes({
                ...baseTypes,
                new_game_submission: 'New Game Submission',
                comment_flagged: 'Comment Flagged',
                user_reported: 'User Reported',
            });
        } else if (userRole === 'developer' || auth.user.is_developer) {
            setNotificationTypes({
                ...baseTypes,
                game_approved: 'Game Approved',
                game_rejected: 'Game Rejected',
                game_under_review: 'Game Under Review',
                new_comment: 'New Comment',
            });
        } else {
            setNotificationTypes({
                ...baseTypes,
                comment_approved: 'Comment Approved',
                comment_rejected: 'Comment Rejected',
                new_game: 'New Game Available',
            });
        }
    }, [auth.user]);

    // Get CSRF token from meta tag
    const getCsrfToken = () => {
        return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'game_approved':
                return (
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                );
            case 'game_rejected':
                return (
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                );
            case 'comment_approved':
            case 'comment_rejected':
            case 'new_comment':
                return (
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                    </div>
                );

            default:
                return (
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                );
        }
    };

    const markAsRead = async (id) => {
        try {
            await axios.post(route('notifications.markAsRead', id), {}, {
                headers: {
                    'X-CSRF-TOKEN': getCsrfToken(),
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                withCredentials: true
            });
            // Refresh the page to update the notification list
            window.location.reload();
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await axios.post(route('notifications.markAllAsRead'), {}, {
                headers: {
                    'X-CSRF-TOKEN': getCsrfToken(),
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                withCredentials: true
            });
            // Refresh the page to update the notification list
            window.location.reload();
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    };

    const deleteNotification = async (id) => {
        try {
            await axios.delete(route('notifications.destroy', id), {
                headers: {
                    'X-CSRF-TOKEN': getCsrfToken(),
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                withCredentials: true
            });
            // Refresh the page to update the notification list
            window.location.reload();
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    const deleteAllNotifications = async () => {
        try {
            await axios.delete(route('notifications.destroyAll'), {
                headers: {
                    'X-CSRF-TOKEN': getCsrfToken(),
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                withCredentials: true
            });
            // Refresh the page to update the notification list
            window.location.reload();
        } catch (error) {
            console.error('Error deleting all notifications:', error);
        }
    };

    return (
        <NotificationLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{t('notifications.center.title')}</h2>}
        >
            <Head title={t('notifications.center.title')} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-medium text-gray-900">{t('notifications.center.title')}</h3>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={markAllAsRead}
                                        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        {t('notifications.center.mark_all_read')}
                                    </button>
                                    <button
                                        onClick={deleteAllNotifications}
                                        className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                    >
                                        {t('notifications.center.clear_all')}
                                    </button>
                                </div>
                            </div>

                            {notifications.data.length > 0 ? (
                                <div className="space-y-4">
                                    {notifications.data.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className={`flex items-start p-4 border rounded-lg ${!notification.read_at ? 'bg-blue-50 border-blue-200' : 'border-gray-200'}`}
                                        >
                                            {getNotificationIcon(notification.data.type)}
                                            <div className="ml-4 flex-1">
                                                <div className="flex items-center justify-between">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {notificationTypes[notification.data.type] || t(`notifications.types.${notification.data.type}`)}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {new Date(notification.created_at).toLocaleString()}
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    {notification.data.message ?
                                                        (typeof notification.data.message === 'string' && notification.data.message.startsWith('notifications.')
                                                            ? t(notification.data.message, notification.data.message_params || {})
                                                            : notification.data.message)
                                                        : notification.data.type
                                                            ? t(`notifications.messages.${notification.data.type}`, notification.data.message_params || {})
                                                            : ''}
                                                </p>
                                                <div className="mt-2 flex justify-end space-x-2">
                                                    {notification.data.url && (
                                                        <a
                                                            href={notification.data.url}
                                                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                        >
                                                            {t('notifications.actions.view')}
                                                        </a>
                                                    )}
                                                    {!notification.read_at && (
                                                        <button
                                                            onClick={() => markAsRead(notification.id)}
                                                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                                        >
                                                            {t('notifications.actions.mark_read')}
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => deleteNotification(notification.id)}
                                                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                                    >
                                                        {t('notifications.actions.delete')}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">{t('notifications.center.no_notifications')}</h3>
                                </div>
                            )}

                            {notifications.data.length > 0 && (
                                <div className="mt-6">
                                    <nav className="flex items-center justify-between">
                                        <div className="flex-1 flex justify-between">
                                            {notifications.links.prev && (
                                                <a
                                                    href={notifications.links.prev}
                                                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                                >
                                                    {t('pagination.previous')}
                                                </a>
                                            )}
                                            {notifications.links.next && (
                                                <a
                                                    href={notifications.links.next}
                                                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                                >
                                                    {t('pagination.next')}
                                                </a>
                                            )}
                                        </div>
                                    </nav>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </NotificationLayout>
    );
}
