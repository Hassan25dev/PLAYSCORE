import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { useTranslation } from '../../../lang/translationHelper';
import Pagination from '../../../Components/Pagination';

export default function UserManagementIndex({ auth, users, counts, roles, filters }) {
    const { t, locale } = useTranslation();

    // Force re-render when locale changes
    const [currentLocale, setCurrentLocale] = useState(locale);

    useEffect(() => {
        if (locale !== currentLocale) {
            setCurrentLocale(locale);
        }
    }, [locale, currentLocale]);
    const [searchTerm, setSearchTerm] = useState(filters.search || '');

    // Use direct router calls instead of useForm for more predictable behavior
    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.users.index'), {
            search: searchTerm,
            role: filters.role || '',
            per_page: filters.per_page || 10,
            page: 1
        }, {
            preserveState: true,
            preserveScroll: false,
            replace: true
        });
    };

    const handleRoleFilter = (role) => {
        // Use direct router.get call for immediate effect
        router.get(route('admin.users.index'), {
            search: filters.search || '',
            role: role,
            per_page: filters.per_page || 10,
            page: 1
        }, {
            preserveState: true,
            preserveScroll: false,
            replace: true
        });
    };

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
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{t('admin.user_management.title')}</h2>}
        >
            <Head title={t('admin.user_management.title')} />

            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                        <div className="flex flex-wrap gap-2 mb-4 md:mb-0">
                            <button
                                onClick={() => handleRoleFilter('')}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                                    filters.role === ''
                                        ? 'bg-indigo-600 text-white shadow-md'
                                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                }`}
                            >
                                {t('admin.user_management.all_users')} ({counts.total})
                            </button>
                            <button
                                onClick={() => handleRoleFilter('admin')}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                                    filters.role === 'admin'
                                        ? 'bg-indigo-600 text-white shadow-md'
                                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                }`}
                            >
                                {t('admin.user_management.admins')} ({counts.admin})
                            </button>
                            <button
                                onClick={() => handleRoleFilter('developer')}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                                    filters.role === 'developer'
                                        ? 'bg-indigo-600 text-white shadow-md'
                                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                }`}
                            >
                                {t('admin.user_management.developers')} ({counts.developer})
                            </button>
                            <button
                                onClick={() => handleRoleFilter('moderator')}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                                    filters.role === 'moderator'
                                        ? 'bg-indigo-600 text-white shadow-md'
                                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                }`}
                            >
                                {t('admin.user_management.moderators')} ({counts.moderator})
                            </button>
                            <button
                                onClick={() => handleRoleFilter('user')}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                                    filters.role === 'user'
                                        ? 'bg-indigo-600 text-white shadow-md'
                                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                }`}
                            >
                                {t('admin.user_management.regular_users')} ({counts.user})
                            </button>
                        </div>
                        <div className="flex items-center">
                            <form onSubmit={handleSearch} className="flex">
                                <input
                                    type="text"
                                    placeholder={t('common.search')}
                                    className="px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-r-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    {t('common.search')}
                                </button>
                            </form>
                            <Link
                                href={route('admin.users.create')}
                                className="ml-4 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                                {t('admin.user_management.add_user')}
                            </Link>
                            <button
                                onClick={() => window.location.reload()}
                                className="ml-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
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

            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div className="p-6">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {t('auth.name')}
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {t('auth.email')}
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {t('admin.user_management.role')}
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {t('admin.user_management.registration_date')}
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {t('admin.user_management.status')}
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {t('admin.actions.view')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.data.map((user) => (
                                    <tr key={user.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                                        <span className="text-indigo-800 font-medium text-lg">
                                                            {user.name.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{user.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeClass(user.role)}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{formatDate(user.created_at)}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {user.is_active ? t('admin.user_management.active') : t('admin.user_management.inactive')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Link
                                                href={route('admin.users.edit', user.id)}
                                                className="text-indigo-600 hover:text-indigo-900 mr-3"
                                            >
                                                {t('admin.actions.edit')}
                                            </Link>
                                            <Link
                                                href={route('admin.users.show', user.id)}
                                                className="text-indigo-600 hover:text-indigo-900"
                                            >
                                                {t('admin.actions.view')}
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-6">
                        <Pagination links={users.links} />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
