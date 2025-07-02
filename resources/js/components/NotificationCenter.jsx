import React, { useState, useEffect, useRef } from 'react';
import { Link } from '@inertiajs/react';
import { useTranslation } from '../lang/translationHelper';
import axios from 'axios';

export default function NotificationCenter({ user }) {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const dropdownRef = useRef(null);

    // Get CSRF token from meta tag
    const getCsrfToken = () => {
        return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    };

    // Fetch notifications when component mounts
    useEffect(() => {
        fetchNotifications();

        // Close dropdown when clicking outside
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const fetchNotifications = async () => {
        setIsLoading(true);
        try {
            // Pass the user role to get role-specific notifications
            const role = user.role === 'admin' ? 'admin' :
                        (user.role === 'developer' || user.is_developer ? 'developer' : 'user');

            // Log the role for debugging
            console.log('Fetching notifications for role:', role);

            const response = await axios.get(route('notifications.index', { role }), {
                headers: {
                    'X-CSRF-TOKEN': getCsrfToken(),
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                withCredentials: true
            });
            console.log('Notifications response:', response.data);

            setNotifications(response.data.notifications);
            setUnreadCount(response.data.unreadCount);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setIsLoading(false);
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
            setNotifications(notifications.map(notification =>
                notification.id === id ? { ...notification, read_at: new Date().toISOString() } : notification
            ));
            setUnreadCount(prev => Math.max(0, prev - 1));
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
            setNotifications(notifications.map(notification => ({
                ...notification,
                read_at: notification.read_at || new Date().toISOString()
            })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    };

    const getNotificationIcon = (type) => {
        // If type is null or undefined, return default icon
        if (!type) {
            return (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
            );
        }

        switch (type) {
            case 'game_approved':
            case 'evaluation_approved':
                return (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                );
            case 'game_rejected':
            case 'evaluation_rejected':
                return (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                );
            case 'comment_approved':
            case 'comment_rejected':
            case 'new_comment':
                return (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                    </div>
                );

            default:
                return (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                );
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
            >
                <span className="sr-only">{t('notifications.center.title')}</span>
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-600 text-xs text-white text-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                    <div className="py-1">
                        <div className="px-4 py-2 border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <h3 className="text-sm font-medium text-gray-900">{t('notifications.center.title')}</h3>
                                {unreadCount > 0 && (
                                    <button
                                        onClick={markAllAsRead}
                                        className="text-xs text-blue-600 hover:text-blue-800"
                                    >
                                        {t('notifications.center.mark_all_read')}
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="max-h-60 overflow-y-auto">
                            {isLoading ? (
                                <div className="px-4 py-2 text-center text-sm text-gray-500">
                                    {t('common.loading')}...
                                </div>
                            ) : notifications.length > 0 ? (
                                notifications.map((notification) => {
                                    // Debug log to help troubleshoot notification data structure
                                    console.log('Notification data:', notification.id, notification.data);

                                    // Check if notification data is valid
                                    if (!notification || !notification.id) {
                                        return null; // Skip invalid notifications
                                    }

                                    return (
                                    <div
                                        key={notification.id}
                                        className={`px-4 py-2 hover:bg-gray-50 ${!notification.read_at ? 'bg-blue-50' : ''}`}
                                    >
                                        <div className="flex items-start">
                                            {getNotificationIcon(notification.data ? notification.data.type : null)}
                                            <div className="ml-3 flex-1">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {notification.data && notification.data.type ?
                                                        (t(`notifications.types.${notification.data.type}`) !== `notifications.types.${notification.data.type}` ?
                                                            t(`notifications.types.${notification.data.type}`) :
                                                            notification.data.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
                                                        ) :
                                                        'Notification'
                                                    }
                                                </div>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    {notification.data && notification.data.message ?
                                                        (typeof notification.data.message === 'string' && notification.data.message.startsWith('notifications.')
                                                            ? (t(notification.data.message, notification.data.message_params || {}) !== notification.data.message
                                                                ? t(notification.data.message, notification.data.message_params || {})
                                                                : `Notification for ${notification.data.type.replace(/_/g, ' ')}`)
                                                            : notification.data.message)
                                                        : notification.data && notification.data.type
                                                            ? (t(`notifications.messages.${notification.data.type}`, notification.data.message_params || {}) !== `notifications.messages.${notification.data.type}`
                                                                ? t(`notifications.messages.${notification.data.type}`, notification.data.message_params || {})
                                                                : `Notification for ${notification.data.type.replace(/_/g, ' ')}`)
                                                            : 'New notification'}
                                                </p>
                                                <div className="mt-1 flex justify-between items-center">
                                                    <span className="text-xs text-gray-500">
                                                        {new Date(notification.created_at).toLocaleString()}
                                                    </span>
                                                    {!notification.read_at && (
                                                        <button
                                                            onClick={() => markAsRead(notification.id)}
                                                            className="text-xs text-blue-600 hover:text-blue-800"
                                                        >
                                                            {t('notifications.actions.mark_read')}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )})
                            ) : (
                                <div className="px-4 py-2 text-center text-sm text-gray-500">
                                    {t('notifications.center.no_notifications')}
                                </div>
                            )}
                        </div>

                        <div className="px-4 py-2 border-t border-gray-200">
                            <Link
                                href={route('notifications.all')}
                                className="block text-center text-sm text-blue-600 hover:text-blue-800"
                                onClick={() => setIsOpen(false)}
                            >
                                {t('notifications.center.view_all')}
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
