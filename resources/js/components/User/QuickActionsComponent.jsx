import React from 'react';
import { Link } from '@inertiajs/react';
import { useTranslation } from '../../lang/translationHelper';

export default function QuickActionsComponent() {
    const { t } = useTranslation();

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
            <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    {t('dashboard.quick_actions') || 'Quick Actions'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Link
                        href={route('jeux.index')}
                        className="flex flex-col p-5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 border border-blue-200 group"
                    >
                        <div className="flex items-center mb-4">
                            <div className="p-3 mr-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg text-white shadow-md group-hover:shadow-lg transition-all duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-700">{t('dashboard.browse_games') || 'Browse Games'}</p>
                            </div>
                        </div>
                        <span className="text-blue-600 group-hover:text-blue-800 transition-colors self-end">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </span>
                    </Link>

                    <Link
                        href={route('profile.edit')}
                        className="flex flex-col p-5 bg-gradient-to-br from-green-50 to-green-100 rounded-xl hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 border border-green-200 group"
                    >
                        <div className="flex items-center mb-4">
                            <div className="p-3 mr-4 bg-gradient-to-br from-green-500 to-green-600 rounded-lg text-white shadow-md group-hover:shadow-lg transition-all duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-700">{t('dashboard.edit_profile') || 'Edit Profile'}</p>
                            </div>
                        </div>
                        <span className="text-green-600 group-hover:text-green-800 transition-colors self-end">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </span>
                    </Link>

                    <Link
                        href={route('notifications.all')}
                        className="flex flex-col p-5 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 border border-purple-200 group"
                    >
                        <div className="flex items-center mb-4">
                            <div className="p-3 mr-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg text-white shadow-md group-hover:shadow-lg transition-all duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-700">{t('dashboard.notifications') || 'Notifications'}</p>
                            </div>
                        </div>
                        <span className="text-purple-600 group-hover:text-purple-800 transition-colors self-end">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
