import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import CommentForm from './CommentForm';
import { scrollToTop } from '../../utils/scrollUtils';
import './CommentsAndReviews.css';

export default function CommentsSection({ auth, gameId }) {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedComments, setExpandedComments] = useState({});
    const [showFloatingButton, setShowFloatingButton] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState(null);
    const sectionRef = useRef(null);
    const formRef = useRef(null);

    const fetchComments = async (page = 1) => {
        setLoading(true);
        try {
            const response = await axios.get(route('comments.index', {
                jeu_id: gameId,
                page: page
            }));
            setComments(response.data.comments.data || []);
            setPagination(response.data.comments);
            setCurrentPage(page);
            setError(null);
        } catch (err) {
            console.error('Error fetching comments:', err);
            setError('Impossible de charger les commentaires. Veuillez réessayer plus tard.');
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        fetchComments(page);
        // Scroll to the top of the comments section
        if (sectionRef.current) {
            sectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    useEffect(() => {
        if (gameId) {
            fetchComments(currentPage);
        }
    }, [gameId]);

    // Handle scroll to show/hide floating button
    useEffect(() => {
        const handleScroll = () => {
            if (!sectionRef.current) return;

            const rect = sectionRef.current.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            const isScrolledPast = rect.top < 0;

            setShowFloatingButton(isVisible && isScrolledPast);
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial check

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const toggleCommentExpansion = (commentId) => {
        setExpandedComments(prev => ({
            ...prev,
            [commentId]: !prev[commentId]
        }));
    };

    const scrollToForm = () => {
        if (formRef.current) {
            formRef.current.scrollIntoView({ behavior: 'smooth' });
            setShowForm(true);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('fr-FR', options);
    };

    return (
        <section className="comments-section" ref={sectionRef}>
            <h2>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 20 20">
                    <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#4e63ff" />
                            <stop offset="100%" stopColor="#8338ec" />
                        </linearGradient>
                    </defs>
                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                </svg>
                Commentaires
            </h2>

            <div ref={formRef}>
                {auth ? (
                    <CommentForm
                        gameId={gameId}
                        onSuccess={fetchComments}
                        showForm={showForm}
                        setShowForm={setShowForm}
                    />
                ) : (
                    <div className="comment-form">
                        <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="url(#gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="8" x2="12" y2="12"></line>
                                <line x1="12" y1="16" x2="12.01" y2="16"></line>
                            </svg>
                            <p className="ml-3 text-b8c0ff font-medium">
                                Connectez-vous pour laisser un commentaire.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-4e63ff"></div>
                </div>
            ) : error ? (
                <div className="comment-form">
                    <div className="text-red-400 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                        <p className="ml-3">{error}</p>
                    </div>
                </div>
            ) : comments.length > 0 ? (
                <div className="comments-list">
                    {comments.map((comment) => (
                        <div key={comment.id} className="comment-item">
                            <div
                                className="comment-header"
                                onClick={() => toggleCommentExpansion(comment.id)}
                            >
                                <div className="user-info">
                                    <div className="user-avatar">
                                        {comment.user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="user-name">{comment.user.name}</div>
                                        <div className="comment-date">
                                            {formatDate(comment.created_at)}
                                        </div>
                                    </div>
                                </div>

                                <button
                                    className="comment-expand-button"
                                    aria-label={expandedComments[comment.id] ? "Collapse comment" : "Expand comment"}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className={`expand-icon ${expandedComments[comment.id] ? 'expanded' : ''}`}
                                    >
                                        <polyline points="6 9 12 15 18 9"></polyline>
                                    </svg>
                                </button>
                            </div>

                            <div className={`comment-content ${expandedComments[comment.id] ? 'expanded' : 'collapsed'}`}>
                                <p>{comment.content}</p>

                                {comment.replies && comment.replies.length > 0 && (
                                    <div className="comment-replies">
                                        {comment.replies.map(reply => (
                                            <div key={reply.id} className="reply-item">
                                                <div className="user-info">
                                                    <div className="user-avatar small">
                                                        {reply.user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="user-name">{reply.user.name}</div>
                                                        <div className="comment-date">
                                                            {formatDate(reply.created_at)}
                                                        </div>
                                                    </div>
                                                </div>
                                                <p>{reply.content}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {/* Pagination */}
                    {pagination && pagination.last_page > 1 && (
                        <div className="comments-pagination">
                            {(() => {
                                const maxVisiblePages = 5;
                                const pages = [];
                                const { current_page, last_page } = pagination;

                                // Always show first page
                                pages.push(
                                    <button
                                        key={1}
                                        disabled={1 === current_page}
                                        onClick={() => handlePageChange(1)}
                                        className={1 === current_page ? 'pagination-button active' : 'pagination-button'}
                                    >
                                        1
                                    </button>
                                );

                                // Calculate range of pages to show
                                let startPage = Math.max(2, current_page - Math.floor(maxVisiblePages / 2));
                                let endPage = Math.min(last_page - 1, startPage + maxVisiblePages - 3);

                                // Adjust if we're near the beginning
                                if (startPage > 2) {
                                    pages.push(
                                        <span key="ellipsis-start" className="pagination-ellipsis">...</span>
                                    );
                                }

                                // Add middle pages
                                for (let i = startPage; i <= endPage; i++) {
                                    pages.push(
                                        <button
                                            key={i}
                                            disabled={i === current_page}
                                            onClick={() => handlePageChange(i)}
                                            className={i === current_page ? 'pagination-button active' : 'pagination-button'}
                                        >
                                            {i}
                                        </button>
                                    );
                                }

                                // Add ellipsis before last page if needed
                                if (endPage < last_page - 1) {
                                    pages.push(
                                        <span key="ellipsis-end" className="pagination-ellipsis">...</span>
                                    );
                                }

                                // Always show last page if there's more than one page
                                if (last_page > 1) {
                                    pages.push(
                                        <button
                                            key={last_page}
                                            disabled={last_page === current_page}
                                            onClick={() => handlePageChange(last_page)}
                                            className={last_page === current_page ? 'pagination-button active' : 'pagination-button'}
                                        >
                                            {last_page}
                                        </button>
                                    );
                                }

                                return pages;
                            })()}
                        </div>
                    )}
                </div>
            ) : (
                <div className="empty-state">
                    <div className="empty-state-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="url(#gradient)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </div>
                    <p className="empty-state-text">Aucun commentaire pour le moment. Soyez le premier à commenter !</p>
                </div>
            )}

            {/* Floating Add Comment Button */}
            {auth && showFloatingButton && (
                <button
                    className="floating-comment-button"
                    onClick={scrollToForm}
                    aria-label="Add comment"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
                    </svg>
                </button>
            )}
        </section>
    );
}
