import React, { useRef, useState } from 'react';
import { useTranslation } from '../../../../lang/translationHelper';
import InputError from '../../../../Components/InputError';
import InputLabel from '../../../../Components/InputLabel';
import SecondaryButton from '../../../../Components/SecondaryButton';

export default function MediaStep({ data, setData, errors, stepErrors, handleFileChange, previewImage, setPreviewImage, videoPreview: existingVideoPreview }) {
    const { t } = useTranslation();
    const fileInputRef = useRef(null);
    const videoInputRef = useRef(null);
    const [videoFile, setVideoFile] = useState(null);
    const [videoPreview, setVideoPreview] = useState(existingVideoPreview || null);

    // Handle click on the file upload button
    const handleUploadClick = () => {
        fileInputRef.current.click();
    };

    // Handle click on the video upload button
    const handleVideoUploadClick = () => {
        videoInputRef.current.click();
    };

    // Handle drag over event
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    // Handle drop event
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            // Create a synthetic event object with a target.files property
            const syntheticEvent = { target: { files: [file] } };
            handleFileChange(syntheticEvent);
        }
    };

    // Handle removing the image
    const handleRemoveImage = () => {
        setData('image_arriere_plan', null);
        setPreviewImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Handle video file change
    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setVideoFile(file);
            setData('video', file);

            // Create a preview URL for the video
            const videoUrl = URL.createObjectURL(file);
            setVideoPreview(videoUrl);
        }
    };

    // Handle removing the video
    const handleRemoveVideo = () => {
        setData('video', null);
        setVideoFile(null);
        setVideoPreview(null);
        if (videoInputRef.current) {
            videoInputRef.current.value = '';
        }
    };

    return (
        <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">{t('developer.submission.step_2')}</h4>

            <div className="mb-6">
                <InputLabel htmlFor="image_arriere_plan" value={t('developer.form.cover_image')} required />

                <div
                    className={`mt-2 border-2 border-dashed rounded-lg p-6 text-center ${
                        previewImage ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-indigo-500'
                    }`}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                >
                    {previewImage ? (
                        <div className="relative">
                            <img
                                src={previewImage}
                                alt="Preview"
                                className="max-h-64 mx-auto rounded-lg shadow-md"
                            />
                            <button
                                type="button"
                                onClick={handleRemoveImage}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none"
                                title={t('admin.actions.delete')}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    ) : (
                        <div className="py-8">
                            <svg
                                className="mx-auto h-12 w-12 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                ></path>
                            </svg>
                            <p className="mt-2 text-sm text-gray-600">{t('developer.form.drop_files')}</p>
                            <SecondaryButton
                                type="button"
                                className="mt-4"
                                onClick={handleUploadClick}
                            >
                                {t('developer.form.upload_image')}
                            </SecondaryButton>
                        </div>
                    )}

                    <input
                        id="image_arriere_plan"
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleFileChange}
                        accept="image/jpeg,image/png,image/gif,image/jpg"
                    />
                </div>

                <InputError message={errors.image_arriere_plan || stepErrors.image_arriere_plan} className="mt-2" />

                <p className="mt-2 text-sm text-gray-500">
                    {t('developer.messages.image_requirements')}
                </p>
            </div>

            {/* Video upload section */}
            <div className="mb-6">
                <InputLabel htmlFor="video" value={t('developer.form.game_video')} />

                <div
                    className={`mt-2 border-2 border-dashed rounded-lg p-6 text-center ${
                        videoPreview ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-indigo-500'
                    }`}
                >
                    {videoPreview ? (
                        <div className="relative">
                            {videoPreview.includes('youtube') ? (
                                <iframe
                                    src={videoPreview}
                                    className="w-full h-64 rounded-lg mx-auto"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            ) : (
                                <video
                                    src={videoPreview}
                                    controls
                                    className="max-h-64 mx-auto rounded-lg shadow-md"
                                />
                            )}
                            <button
                                type="button"
                                onClick={handleRemoveVideo}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none"
                                title={t('admin.actions.delete')}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    ) : (
                        <div className="py-8">
                            <svg
                                className="mx-auto h-12 w-12 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                ></path>
                            </svg>
                            <p className="mt-2 text-sm text-gray-600">{t('developer.form.upload_video_description')}</p>
                            <SecondaryButton
                                type="button"
                                className="mt-4"
                                onClick={handleVideoUploadClick}
                            >
                                {t('developer.form.upload_video')}
                            </SecondaryButton>
                        </div>
                    )}

                    <input
                        id="video"
                        type="file"
                        ref={videoInputRef}
                        className="hidden"
                        onChange={handleVideoChange}
                        accept="video/mp4,video/webm,video/ogg"
                    />
                </div>

                <InputError message={errors.video || stepErrors.video} className="mt-2" />

                <p className="mt-2 text-sm text-gray-500">
                    {t('developer.messages.video_requirements')}
                </p>
            </div>
        </div>
    );
}
