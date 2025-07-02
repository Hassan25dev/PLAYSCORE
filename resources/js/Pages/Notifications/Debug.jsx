import React from 'react';
import { Head } from '@inertiajs/react';
import NotificationLayout from '@/Layouts/NotificationLayout';
import { useTranslation } from '@/lang/translationHelper';

export default function Debug({ auth, allNotifications, filteredNotifications, userRole, sqlQuery, sqlBindings }) {
    const { t } = useTranslation();

    // Function to get notification icon based on type
    const getNotificationIcon = (type) => {
        switch (type) {
            case 'game_approved':
                return (
                    <svg className="h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            case 'game_rejected':
                return (
                    <svg className="h-6 w-6 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            case 'comment_approved':
            case 'evaluation_approved':
                return (
                    <svg className="h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                );
            case 'comment_rejected':
            case 'evaluation_rejected':
                return (
                    <svg className="h-6 w-6 text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                );
            default:
                return (
                    <svg className="h-6 w-6 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                );
        }
    };

    return (
        <NotificationLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Notification Debug</h2>}
        >
            <Head title="Notification Debug" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h2 className="text-2xl font-bold mb-4">Notification System Debug</h2>
                        
                        <div className="mb-8">
                            <h3 className="text-xl font-semibold mb-2">User Information</h3>
                            <div className="bg-gray-100 p-4 rounded">
                                <p><strong>User ID:</strong> {auth.user.id}</p>
                                <p><strong>User Name:</strong> {auth.user.name}</p>
                                <p><strong>User Role:</strong> {userRole}</p>
                            </div>
                        </div>

                        <div className="mb-8">
                            <h3 className="text-xl font-semibold mb-2">SQL Query</h3>
                            <div className="bg-gray-100 p-4 rounded overflow-x-auto">
                                <pre className="text-sm">{sqlQuery}</pre>
                                <p className="mt-2"><strong>Bindings:</strong> {JSON.stringify(sqlBindings)}</p>
                            </div>
                        </div>

                        <div className="mb-8">
                            <h3 className="text-xl font-semibold mb-2">Notification Counts</h3>
                            <div className="bg-gray-100 p-4 rounded">
                                <p><strong>All Notifications:</strong> {allNotifications.length}</p>
                                <p><strong>Filtered Notifications:</strong> {filteredNotifications.length}</p>
                                <p><strong>Filtered Out:</strong> {allNotifications.length - filteredNotifications.length}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-xl font-semibold mb-2">All Notifications ({allNotifications.length})</h3>
                                <div className="bg-gray-100 p-4 rounded max-h-96 overflow-y-auto">
                                    {allNotifications.length > 0 ? (
                                        <div className="space-y-4">
                                            {allNotifications.map((notification) => (
                                                <div key={notification.id} className="flex items-start p-4 border rounded-lg bg-white">
                                                    {getNotificationIcon(notification.data.type)}
                                                    <div className="ml-4 flex-1">
                                                        <div className="flex items-center justify-between">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {notification.data.type || 'Unknown Type'}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {new Date(notification.created_at).toLocaleString()}
                                                            </div>
                                                        </div>
                                                        <p className="text-sm text-gray-600 mt-1">
                                                            {notification.data.message || 'No message'}
                                                        </p>
                                                        <div className="mt-2 text-xs text-gray-500">
                                                            <p><strong>For Roles:</strong> {notification.data.for_roles ? JSON.stringify(notification.data.for_roles) : 'None'}</p>
                                                            <p><strong>Read:</strong> {notification.read_at ? 'Yes' : 'No'}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-center text-gray-500">No notifications found</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mb-2">Filtered Notifications ({filteredNotifications.length})</h3>
                                <div className="bg-gray-100 p-4 rounded max-h-96 overflow-y-auto">
                                    {filteredNotifications.length > 0 ? (
                                        <div className="space-y-4">
                                            {filteredNotifications.map((notification) => (
                                                <div key={notification.id} className="flex items-start p-4 border rounded-lg bg-white">
                                                    {getNotificationIcon(notification.data.type)}
                                                    <div className="ml-4 flex-1">
                                                        <div className="flex items-center justify-between">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {notification.data.type || 'Unknown Type'}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {new Date(notification.created_at).toLocaleString()}
                                                            </div>
                                                        </div>
                                                        <p className="text-sm text-gray-600 mt-1">
                                                            {notification.data.message || 'No message'}
                                                        </p>
                                                        <div className="mt-2 text-xs text-gray-500">
                                                            <p><strong>For Roles:</strong> {notification.data.for_roles ? JSON.stringify(notification.data.for_roles) : 'None'}</p>
                                                            <p><strong>Read:</strong> {notification.read_at ? 'Yes' : 'No'}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-center text-gray-500">No filtered notifications found</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </NotificationLayout>
    );
}
