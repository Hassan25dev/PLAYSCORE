import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import { useTranslation } from '../../../../lang/translationHelper';

const ReviewSubmitStep = forwardRef(({ data, platforms, genres, tags, previewImage, hideVideo = false, existingVideoUrl }, ref) => {
    const { t } = useTranslation();
    const videoRef = useRef(null);

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
        pauseVideo: () => {
            if (videoRef.current) {
                videoRef.current.pause();
            }
        }
    }));

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString();
    };

    // Get platform names
    const getPlatformNames = () => {
        return data.plateforme_ids.map(id => {
            const platform = platforms.find(p => p.id === id);
            return platform ? platform.nom : '';
        }).filter(Boolean).join(', ');
    };

    // Get genre names
    const getGenreNames = () => {
        return data.genre_ids.map(id => {
            const genre = genres.find(g => g.id === id);
            return genre ? genre.nom : '';
        }).filter(Boolean).join(', ');
    };

    // Get tag names
    const getTagNames = () => {
        return data.tag_ids.map(id => {
            const tag = tags.find(t => t.id === id);
            return tag ? tag.nom : '';
        }).filter(Boolean).join(', ');
    };

    return (
        <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">{t('developer.submission.step_4')}</h4>

            <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <h5 className="font-medium text-gray-900 mb-4">{t('developer.submission.review_info')}</h5>
                <p className="text-sm text-gray-600 mb-4">{t('developer.messages.review_description')}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h6 className="font-medium text-gray-800 mb-2">{t('developer.form.title')}</h6>
                        <p className="text-gray-700">{data.titre}</p>
                    </div>

                    <div>
                        <h6 className="font-medium text-gray-800 mb-2">{t('developer.form.release_date')}</h6>
                        <p className="text-gray-700">{formatDate(data.date_sortie)}</p>
                    </div>

                    <div className="md:col-span-2">
                        <h6 className="font-medium text-gray-800 mb-2">{t('developer.form.description')}</h6>
                        <div className="text-gray-700 whitespace-pre-wrap bg-white p-4 rounded border border-gray-200 max-h-40 overflow-y-auto">
                            {data.description}
                        </div>
                    </div>

                    <div>
                        <h6 className="font-medium text-gray-800 mb-2">{t('developer.form.platforms')}</h6>
                        <p className="text-gray-700">{getPlatformNames() || t('developer.messages.none_selected')}</p>
                    </div>

                    <div>
                        <h6 className="font-medium text-gray-800 mb-2">{t('developer.form.genres')}</h6>
                        <p className="text-gray-700">{getGenreNames() || t('developer.messages.none_selected')}</p>
                    </div>

                    {data.tag_ids.length > 0 && (
                        <div className="md:col-span-2">
                            <h6 className="font-medium text-gray-800 mb-2">{t('developer.form.tags')}</h6>
                            <p className="text-gray-700">{getTagNames()}</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
                <h5 className="font-medium text-gray-900 mb-4">{t('developer.form.cover_image')}</h5>

                {previewImage ? (
                    <div className="flex justify-center">
                        <img
                            src={previewImage}
                            alt={data.titre}
                            className="max-h-64 rounded-lg shadow-md"
                        />
                    </div>
                ) : (
                    <p className="text-gray-500 text-center py-8">{t('developer.messages.no_image')}</p>
                )}
            </div>

            {/* Game Video Preview */}
            {(data.video || existingVideoUrl) && !hideVideo && (
                <div className="mt-6 bg-gray-50 p-6 rounded-lg">
                    <h5 className="font-medium text-gray-900 mb-4">{t('developer.form.game_video')}</h5>

                    <div className="flex justify-center">
                        {data.video ? (
                            <video
                                ref={videoRef}
                                src={URL.createObjectURL(data.video)}
                                controls
                                className="max-h-64 rounded-lg shadow-md"
                            />
                        ) : existingVideoUrl && existingVideoUrl.includes('youtube') ? (
                            <iframe
                                src={existingVideoUrl}
                                className="w-full h-64 rounded-lg"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        ) : existingVideoUrl && (
                            <video
                                ref={videoRef}
                                src={existingVideoUrl}
                                controls
                                className="max-h-64 rounded-lg shadow-md"
                            />
                        )}
                    </div>
                </div>
            )}

            <div className="mt-6 bg-blue-50 p-4 rounded-md">
                <h5 className="font-medium text-blue-800 mb-2">{t('developer.submission.submission_options')}</h5>
                <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                    <li>{t('developer.messages.save_draft_info')}</li>
                    <li>{t('developer.messages.submit_approval_info')}</li>
                </ul>
            </div>
        </div>
    );
});

// Add display name for debugging
ReviewSubmitStep.displayName = 'ReviewSubmitStep';

export default ReviewSubmitStep;
