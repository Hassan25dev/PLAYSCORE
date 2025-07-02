import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { useTranslation } from '../../../lang/translationHelper';
import Pagination from '../../../Components/Pagination';

export default function GameApprovalIndex({ auth, pendingGames }) {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredGames = pendingGames.data.filter(game => 
        game.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (game.developpeur && game.developpeur.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const getStatusBadge = (status) => {
        switch (status) {
            case 'en_attente':
                return (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        {t('admin.game_approval.pending_games')}
                    </span>
                );
            case 'publie':
                return (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {t('admin.game_approval.approved_games')}
                    </span>
                );
            case 'rejete':
                return (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        {t('admin.game_approval.rejected_games')}
                    </span>
                );
            default:
                return (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        {status}
                    </span>
                );
        }
    };

    return (
        <AdminLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{t('admin.game_approval.title')}</h2>}
        >
            <Head title={t('admin.game_approval.title')} />

            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                <div className="p-6 flex flex-col sm:flex-row justify-between items-center">
                    <div className="flex space-x-2 mb-4 sm:mb-0">
                        <Link
                            href={route('admin.game-approvals.index')}
                            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            {t('admin.game_approval.pending_games')}
                        </Link>
                        <Link
                            href={route('admin.game-approvals.approved')}
                            className="px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            {t('admin.game_approval.approved_games')}
                        </Link>
                        <Link
                            href={route('admin.game-approvals.rejected')}
                            className="px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            {t('admin.game_approval.rejected_games')}
                        </Link>
                    </div>
                    <div className="w-full sm:w-64">
                        <input
                            type="text"
                            placeholder={t('common.search')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">{t('admin.game_approval.pending_games')}</h3>
                    
                    {filteredGames.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            {t('game.title')}
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            {t('admin.game_approval.developer')}
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            {t('admin.game_approval.submission_date')}
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
                                    {filteredGames.map((game) => (
                                        <tr key={game.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    {game.image_url ? (
                                                        <div className="flex-shrink-0 h-10 w-10">
                                                            <img className="h-10 w-10 rounded-md object-cover" src={game.image_url} alt={game.titre} />
                                                        </div>
                                                    ) : (
                                                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-md flex items-center justify-center">
                                                            <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{game.titre}</div>
                                                        <div className="text-sm text-gray-500">
                                                            {game.genres && game.genres.map(genre => genre.nom).join(', ')}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{game.developpeur ? game.developpeur.name : 'Unknown'}</div>
                                                <div className="text-sm text-gray-500">{game.developpeur ? game.developpeur.email : ''}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{new Date(game.created_at).toLocaleDateString()}</div>
                                                <div className="text-sm text-gray-500">{new Date(game.created_at).toLocaleTimeString()}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getStatusBadge(game.statut)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <Link
                                                    href={route('admin.game-approvals.show', game.id)}
                                                    className="text-indigo-600 hover:text-indigo-900"
                                                >
                                                    {t('admin.game_approval.view_details')}
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-4 text-gray-500">
                            {t('admin.game_approval.no_pending_games')}
                        </div>
                    )}

                    <div className="mt-6">
                        <Pagination links={pendingGames.links} />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
