import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import TextArea from '../../Components/TextArea';
import InputError from '../../Components/InputError';
import PrimaryButton from '../../components/PrimaryButton';
import './CommentsAndReviews.css';

export default function CommentForm({ gameId, onSuccess, showForm: externalShowForm, setShowForm: externalSetShowForm }) {
    const [internalShowForm, setInternalShowForm] = useState(false);

    // Use either external or internal state
    const showForm = externalShowForm !== undefined ? externalShowForm : internalShowForm;
    const setShowForm = externalSetShowForm || setInternalShowForm;

    const { data, setData, post, processing, reset, errors } = useForm({
        jeu_id: gameId,
        content: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        // Log the data being submitted
        console.log('Submitting comment:', {
            jeu_id: data.jeu_id,
            content: data.content,
        });

        post(route('comments.store'), {
            onSuccess: (response) => {
                console.log('Comment submitted successfully:', response);
                reset();
                setShowForm(false);
                // Call onSuccess with page 1 to ensure we see the new comment
                if (onSuccess) onSuccess(1);
            },
            onError: (errors) => {
                console.error('Error submitting comment:', errors);
            },
        });
    };

    return (
        <div>
            {!showForm ? (
                <button
                    onClick={() => setShowForm(true)}
                    className="add-button"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                    </svg>
                    Ajouter un commentaire
                </button>
            ) : (
                <div className="comment-form">
                    <h3>
                        Votre commentaire
                    </h3>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="content">Commentaire</label>
                            <TextArea
                                id="content"
                                value={data.content}
                                onChange={(e) => setData('content', e.target.value)}
                                rows={4}
                                placeholder="Partagez votre avis sur ce jeu..."
                            />
                            <InputError message={errors.content} className="mt-2" />
                        </div>

                        <div className="form-buttons">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowForm(false);
                                    reset();
                                }}
                                className="cancel-button"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="submit-button"
                            >
                                Publier
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
