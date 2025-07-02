import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import '../Comments/CommentsAndReviews.css';
import TextArea from '../../Components/TextArea';
import InputError from '../../Components/InputError';
import PrimaryButton from '../../components/PrimaryButton';
import { t } from '../../lang/translationHelper';

export default function ReviewsSection({ auth, gameId, reviews = [] }) {
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [hoveredRating, setHoveredRating] = useState(0);

    const { data, setData, post, processing, reset, errors } = useForm({
        game_id: gameId,
        rating: 0,
        comment: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('ratings.store'), {
            onSuccess: () => {
                reset();
                setShowReviewForm(false);
            },
        });
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        // Use the current locale from the browser
        const locale = document.documentElement.lang || 'fr-FR';
        return new Date(dateString).toLocaleDateString(locale, options);
    };

    const renderStars = (rating) => {
        return (
            <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className={`text-xl ${star <= rating ? 'text-amber-500' : 'text-gray-300'} drop-shadow-sm`}>
                        ★
                    </span>
                ))}
            </div>
        );
    };

    return (
        <section className="reviews-section">
            <h2>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 20 20">
                    <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#4e63ff" />
                            <stop offset="100%" stopColor="#8338ec" />
                        </linearGradient>
                    </defs>
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {t('game_details.reviews_and_comments')}
            </h2>

            {auth ? (
                <div>
                    {!showReviewForm ? (
                        <button
                            onClick={() => setShowReviewForm(true)}
                            className="add-button"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                            </svg>
                            {t('game_details.add_review')}
                        </button>
                    ) : (
                        <div className="review-form">
                            <h3>
                                {t('game_details.share_your_opinion')}
                            </h3>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label htmlFor="rating">{t('game_details.rating')}</label>
                                    <div className="star-rating">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setData('rating', star)}
                                                className={`star ${star <= data.rating ? 'filled' : ''} ${star === hoveredRating ? 'hover-effect' : ''}`}
                                                onMouseEnter={() => setHoveredRating(star)}
                                                onMouseLeave={() => setHoveredRating(0)}
                                            >
                                                ★
                                            </button>
                                        ))}
                                    </div>
                                    <InputError message={errors.rating} className="mt-2" />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="comment">{t('game_details.comment')}</label>
                                    <TextArea
                                        id="comment"
                                        value={data.comment}
                                        onChange={(e) => setData('comment', e.target.value)}
                                        rows={4}
                                        placeholder={t('game_details.share_your_experience')}
                                    />
                                    <InputError message={errors.comment} className="mt-2" />
                                </div>

                                <div className="form-buttons">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowReviewForm(false);
                                            reset();
                                        }}
                                        className="cancel-button"
                                    >
                                        {t('game_details.cancel')}
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="submit-button"
                                    >
                                        {t('game_details.publish')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            ) : (
                <div className="review-form">
                    <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="url(#gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                        <p className="ml-3 text-b8c0ff font-medium">
                            {t('game_details.login_to_review')}
                        </p>
                    </div>
                </div>
            )}

            {reviews.length > 0 ? (
                <div className="reviews-list">
                    {reviews.map((review) => (
                        <div key={review.id} className="review-item">
                            <div className="review-header">
                                <div className="user-info">
                                    <div className="user-avatar">
                                        {review.user_name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="user-name">{review.user_name}</div>
                                        <div className="review-date">
                                            {formatDate(review.created_at)}
                                        </div>
                                    </div>
                                </div>
                                <div className="star-rating">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <span key={star} className={`star ${star <= review.rating ? 'filled' : ''}`}>
                                            ★
                                        </span>
                                    ))}
                                </div>
                            </div>
                            {review.comment && (
                                <div className="review-content">
                                    <p>{review.comment}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <div className="empty-state-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="url(#gradient)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </div>
                    <p className="empty-state-text">{t('game_details.no_reviews')}</p>
                </div>
            )}
        </section>
    );
}
