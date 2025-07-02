import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { useTranslation } from '../../../lang/translationHelper';

export default function UserShow({ auth, user }) {
    const { t } = useTranslation();

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString();
    };

    const getRoleBadgeClass = (role) => {
        switch (role) {
            case 'admin':
                return 'bg-red-100 text-red-800';
            case 'developer':
                return 'bg-blue-100 text-blue-800';
            case 'moderator':
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AdminLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{t('admin.user_management.view_profile')}</h2>}
        >
            <Head title={t('admin.user_management.view_profile')} />

            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                <div className="p-6 flex justify-between items-center">
                    <div>
                        <Link
                            href={route('admin.users.index')}
                            className="text-indigo-600 hover:text-indigo-900"
                        >
                            ← {t('admin.actions.back')}
                        </Link>
                    </div>
                    <div className="flex space-x-2">
                        <Link
                            href={route('admin.users.edit', user.id)}
                            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            {t('admin.actions.edit')}
                        </Link>
                    </div>
                </div>
            </div>

            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                <div className="p-6">
                    <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/3 mb-6 md:mb-0 md:pr-6">
                            <div className="flex justify-center">
                                <div className="h-32 w-32 rounded-full bg-indigo-100 flex items-center justify-center">
                                    <span className="text-indigo-800 font-bold text-4xl">
                                        {user.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="mt-6 text-center">
                                <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                                <p className="text-gray-600">{user.email}</p>
                                <div className="mt-2">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeClass(user.role)}`}>
                                        {user.role}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="mt-6">
                                <div className="flex justify-between py-3 border-b border-gray-200">
                                    <span className="text-gray-500">{t('admin.user_management.status')}</span>
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {user.is_active ? t('admin.user_management.active') : t('admin.user_management.inactive')}
                                    </span>
                                </div>
                                <div className="flex justify-between py-3 border-b border-gray-200">
                                    <span className="text-gray-500">{t('admin.user_management.registration_date')}</span>
                                    <span>{formatDate(user.created_at)}</span>
                                </div>
                                <div className="flex justify-between py-3 border-b border-gray-200">
                                    <span className="text-gray-500">{t('admin.user_management.last_login')}</span>
                                    <span>{user.last_login_at ? formatDate(user.last_login_at) : 'N/A'}</span>
                                </div>
                                <div className="flex justify-between py-3 border-b border-gray-200">
                                    <span className="text-gray-500">{t('admin.user_management.email_verified')}</span>
                                    <span>{user.email_verified_at ? formatDate(user.email_verified_at) : 'No'}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="md:w-2/3">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">{t('admin.user_management.permissions')}</h3>
                            
                            {user.permissions && user.permissions.length > 0 ? (
                                <div className="bg-gray-50 p-4 rounded-md mb-6">
                                    <div className="flex flex-wrap gap-2">
                                        {user.permissions.map(permission => (
                                            <span key={permission.id} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                                {permission.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-gray-50 p-4 rounded-md mb-6 text-gray-500">
                                    {t('admin.messages.no_data')}
                                </div>
                            )}
                            
                            <h3 className="text-lg font-medium text-gray-900 mb-4">{t('admin.user_management.roles')}</h3>
                            
                            <div className="bg-gray-50 p-4 rounded-md mb-6">
                                <div className="flex flex-wrap gap-2">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeClass(user.role)}`}>
                                        {user.role}
                                    </span>
                                </div>
                            </div>
                            
                            {/* Additional user information can be added here */}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
