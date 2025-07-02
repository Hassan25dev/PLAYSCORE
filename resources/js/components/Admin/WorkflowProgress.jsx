import React from 'react';
import { Link } from '@inertiajs/react';
import { useTranslation } from '../../lang/translationHelper';

export default function WorkflowProgress({ stats }) {
    const { t } = useTranslation();

    // Calculate percentages for the progress bars
    const totalGames = stats.total_games || 1; // Prevent division by zero
    const pendingPercentage = (stats.pending_games / totalGames) * 100;
    const approvedPercentage = (stats.approved_games / totalGames) * 100;
    const rejectedPercentage = (stats.rejected_games / totalGames) * 100;

    return (
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
            <div className="p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4">{t('admin.dashboard.workflow_progress')}</h3>

                <div className="space-y-5 sm:space-y-6">
                    {/* Pending Games */}
                    <div>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 sm:mb-2 gap-2 sm:gap-0">
                            <div className="flex items-center">
                                <div className="w-4 h-4 sm:w-3 sm:h-3 bg-yellow-400 rounded-full mr-2"></div>
                                <span className="text-sm sm:text-sm font-medium text-gray-700">{t('admin.game_approval.pending_games')}</span>
                            </div>
                            <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto">
                                <span className="text-sm sm:text-sm font-bold text-gray-900 mr-2">{stats.pending_games}</span>
                                <Link
                                    href={route('admin.game-approvals.index')}
                                    className="text-sm sm:text-xs text-blue-600 hover:text-blue-800 py-1.5 sm:py-1 px-3 sm:px-2 rounded-md hover:bg-blue-50 transition-colors min-h-[32px] sm:min-h-0 flex items-center"
                                >
                                    {t('admin.actions.view')}
                                </Link>
                            </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 sm:h-2.5">
                            <div className="bg-yellow-400 h-3 sm:h-2.5 rounded-full" style={{ width: `${pendingPercentage}%` }}></div>
                        </div>
                    </div>

                    {/* Approved Games */}
                    <div>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 sm:mb-2 gap-2 sm:gap-0">
                            <div className="flex items-center">
                                <div className="w-4 h-4 sm:w-3 sm:h-3 bg-green-500 rounded-full mr-2"></div>
                                <span className="text-sm sm:text-sm font-medium text-gray-700">{t('admin.game_approval.approved_games')}</span>
                            </div>
                            <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto">
                                <span className="text-sm sm:text-sm font-bold text-gray-900 mr-2">{stats.approved_games}</span>
                                <Link
                                    href={route('admin.game-approvals.approved')}
                                    className="text-sm sm:text-xs text-blue-600 hover:text-blue-800 py-1.5 sm:py-1 px-3 sm:px-2 rounded-md hover:bg-blue-50 transition-colors min-h-[32px] sm:min-h-0 flex items-center"
                                >
                                    {t('admin.actions.view')}
                                </Link>
                            </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 sm:h-2.5">
                            <div className="bg-green-500 h-3 sm:h-2.5 rounded-full" style={{ width: `${approvedPercentage}%` }}></div>
                        </div>
                    </div>

                    {/* Rejected Games */}
                    <div>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 sm:mb-2 gap-2 sm:gap-0">
                            <div className="flex items-center">
                                <div className="w-4 h-4 sm:w-3 sm:h-3 bg-red-500 rounded-full mr-2"></div>
                                <span className="text-sm sm:text-sm font-medium text-gray-700">{t('admin.game_approval.rejected_games')}</span>
                            </div>
                            <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto">
                                <span className="text-sm sm:text-sm font-bold text-gray-900 mr-2">{stats.rejected_games}</span>
                                <Link
                                    href={route('admin.game-approvals.rejected')}
                                    className="text-sm sm:text-xs text-blue-600 hover:text-blue-800 py-1.5 sm:py-1 px-3 sm:px-2 rounded-md hover:bg-blue-50 transition-colors min-h-[32px] sm:min-h-0 flex items-center"
                                >
                                    {t('admin.actions.view')}
                                </Link>
                            </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 sm:h-2.5">
                            <div className="bg-red-500 h-3 sm:h-2.5 rounded-full" style={{ width: `${rejectedPercentage}%` }}></div>
                        </div>
                    </div>
                </div>

                {/* Workflow Metrics */}
                <div className="mt-6 sm:mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-4">
                    <div className="bg-gray-50 p-4 sm:p-4 rounded-lg shadow-sm flex flex-row sm:flex-col items-center sm:items-start justify-between sm:justify-start">
                        <p className="text-xs sm:text-xs text-gray-500 uppercase font-medium">{t('admin.dashboard.avg_approval_time')}</p>
                        <p className="text-lg sm:text-xl font-bold text-gray-900">48h</p>
                    </div>
                    <div className="bg-gray-50 p-4 sm:p-4 rounded-lg shadow-sm flex flex-row sm:flex-col items-center sm:items-start justify-between sm:justify-start">
                        <p className="text-xs sm:text-xs text-gray-500 uppercase font-medium">{t('admin.dashboard.approval_rate')}</p>
                        <p className="text-lg sm:text-xl font-bold text-gray-900">
                            {totalGames > 1 ? Math.round((stats.approved_games / (stats.approved_games + stats.rejected_games)) * 100) : 0}%
                        </p>
                    </div>
                    <div className="bg-gray-50 p-4 sm:p-4 rounded-lg shadow-sm flex flex-row sm:flex-col items-center sm:items-start justify-between sm:justify-start">
                        <p className="text-xs sm:text-xs text-gray-500 uppercase font-medium">{t('admin.dashboard.pending_time')}</p>
                        <p className="text-lg sm:text-xl font-bold text-gray-900">24h</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
