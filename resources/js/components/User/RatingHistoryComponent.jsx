import React from 'react';
import { Link } from '@inertiajs/react';
import { useTranslation } from '../../lang/translationHelper';

export default function RatingHistoryComponent({ ratings }) {
    const { t } = useTranslation();

    if (!ratings || ratings.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                            {t('dashboard.rating_history') || 'My Ratings'}
                        </h3>
                    </div>

                    <div className="flex flex-col items-center justify-center py-12 text-center bg-gray-50 rounded-xl border border-gray-100">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-700 mb-2">{t('ratings.empty_title') || 'Share Your Gaming Experience'}</h3>
                        <p className="text-gray-500 mb-6 max-w-md">{t('ratings.empty_description') || 'Rate games you\'ve played to help others discover great games. Your ratings also help us recommend games you might enjoy.'}</p>
                        <div className="space-y-4">
                            <Link
                                href={route('jeux.index')}
                                className="inline-flex items-center px-4 py-2 bg-yellow-500 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-yellow-600 active:bg-yellow-700 focus:outline-none focus:border-yellow-700 focus:ring ring-yellow-300 disabled:opacity-25 transition"
                            >
                                {t('dashboard.find_games_to_rate') || 'Find Games to Rate'}
                            </Link>
                            <div className="text-sm text-gray-500 mt-4">
                                <p>{t('ratings.how_to_rate') || 'To rate a game, visit any game page and click on the star rating.'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const renderStars = (rating) => {
        return (
            <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                        key={star}
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-4 w-4 ${star <= rating ? 'text-yellow-500' : 'text-gray-300'}`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
            </div>
        );
    };

    const renderRatingItem = (rating) => (
        <div key={rating.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
            <div className="flex flex-col sm:flex-row">
                <div className="sm:w-1/4 h-24 sm:h-auto">
                    <Link href={route('jeux.show', rating.game_id)}>
                        <img
                            src={rating.game_image || 'https://via.placeholder.com/300x200?text=No+Image'}
                            alt={rating.game_title}
                            className="w-full h-full object-cover"
                        />
                    </Link>
                </div>
                <div className="p-4 sm:w-3/4">
                    <div className="flex justify-between items-start">
                        <Link
                            href={route('jeux.show', rating.game_id)}
                            className="text-lg font-semibold text-gray-800 hover:text-indigo-600 transition-colors"
                        >
                            {rating.game_title}
                        </Link>
                        <span className="text-xs text-gray-500">{rating.date}</span>
                    </div>
                    <div className="mt-2 flex items-center">
                        {renderStars(rating.rating)}
                        <span className="ml-2 text-sm font-medium text-gray-700">{rating.rating}/5</span>
                    </div>
                    {rating.comment && (
                        <p className="mt-2 text-sm text-gray-600 line-clamp-2">{rating.comment}</p>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                        {t('dashboard.rating_history') || 'My Ratings'}
                    </h3>
                    <Link href={route('ratings.index')} className="text-sm text-yellow-500 hover:text-yellow-700 transition-colors">
                        {t('dashboard.view_all') || 'View All'} →
                    </Link>
                </div>

                <div className="space-y-4">
                    {ratings.map(rating => renderRatingItem(rating))}
                </div>
            </div>
        </div>
    );
}
