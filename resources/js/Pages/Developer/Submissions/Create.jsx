import React, { useState, useEffect, useRef } from 'react';
import { Head, useForm } from '@inertiajs/react';
import DeveloperLayout from '../../../Layouts/DeveloperLayout';
import { useTranslation } from '../../../lang/translationHelper';
import InputError from '../../../Components/InputError';
import InputLabel from '../../../Components/InputLabel';
import PrimaryButton from '../../../Components/PrimaryButton';
import SecondaryButton from '../../../Components/SecondaryButton';
import TextInput from '../../../Components/TextInput';
import TextArea from '../../../Components/TextArea';

// Step Components
import BasicInfoStep from './Steps/BasicInfoStep';
import MediaStep from './Steps/MediaStep';
import PlatformsGenresStep from './Steps/PlatformsGenresStep';
import ReviewSubmitStep from './Steps/ReviewSubmitStep';

export default function Create({ auth, platforms, genres, tags, rawgEnabled }) {
    const { t } = useTranslation();
    const [currentStep, setCurrentStep] = useState(1);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [stepValidationErrors, setStepValidationErrors] = useState({});
    const [previewImage, setPreviewImage] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const reviewStepRef = useRef(null);

    const { data, setData, post, processing, errors, reset, setError, clearErrors } = useForm({
        titre: '',
        description: '',
        date_sortie: '',
        image_arriere_plan: null,
        video: null,
        plateforme_ids: [],
        genre_ids: [],
        tag_ids: [],
        rawg_id: '',
        submit: false, // Whether to submit for approval or save as draft
    });

    // Step validation rules
    const stepValidationRules = {
        1: () => {
            let stepErrors = {};
            if (!data.titre.trim()) {
                stepErrors.titre = t('developer.messages.title_required');
            }
            if (!data.description.trim()) {
                stepErrors.description = t('developer.messages.description_required');
            }
            if (!data.date_sortie) {
                stepErrors.date_sortie = t('developer.messages.release_date_required');
            }
            return stepErrors;
        },
        2: () => {
            let stepErrors = {};
            if (!data.image_arriere_plan && !previewImage) {
                stepErrors.image_arriere_plan = t('developer.messages.image_required');
            }
            return stepErrors;
        },
        3: () => {
            let stepErrors = {};
            if (data.plateforme_ids.length === 0) {
                stepErrors.plateforme_ids = t('developer.messages.platform_required');
            }
            if (data.genre_ids.length === 0) {
                stepErrors.genre_ids = t('developer.messages.genre_required');
            }
            return stepErrors;
        },
        4: () => {
            // Final review step - no additional validation needed
            return {};
        }
    };

    // Validate current step
    const validateStep = () => {
        const errors = stepValidationRules[currentStep]();
        setStepValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Handle next step
    const handleNextStep = () => {
        if (validateStep()) {
            setCurrentStep(currentStep + 1);
            window.scrollTo(0, 0);
        }
    };

    // Handle previous step
    const handlePrevStep = () => {
        setCurrentStep(currentStep - 1);
        window.scrollTo(0, 0);
    };

    // Handle form submission
    const handleSubmit = (submitForApproval = false) => {
        if (currentStep < 4) {
            // If not on the final step, move to the next step
            handleNextStep();
            return;
        }

        // Set loading state immediately to prevent UI glitches
        setIsSubmitting(true);

        // Get submit value
        const submitValue = submitForApproval === true;

        // Small delay to ensure the loading state is applied before continuing
        setTimeout(() => {
            // Pause any video playback to prevent glitching
            if (reviewStepRef.current) {
                reviewStepRef.current.pauseVideo();
            }

            // Set submit flag based on whether submitting for approval or saving as draft
            setData('submit', submitValue);
            setFormSubmitted(true);

            console.log('Submitting game with submit value:', submitValue);

            // Submit the form
            post(route('game-submissions.store'), {
                forceFormData: true,
                // Don't use the data property, as it might override the form data
                // Instead, make sure submit is set in the form data before posting
                onSuccess: () => {
                    console.log('Game submitted successfully with status:', submitValue ? 'en_attente' : 'brouillon');
                    reset();
                    setPreviewImage(null);
                    setIsSubmitting(false);
                },
                onError: (errors) => {
                    console.error('Submission errors:', errors);
                    setIsSubmitting(false);
                    // If there are errors, show them in the appropriate step
                    if (errors.titre || errors.description || errors.date_sortie) {
                        setCurrentStep(1);
                    } else if (errors.image_arriere_plan) {
                        setCurrentStep(2);
                    } else if (errors.plateforme_ids || errors.genre_ids) {
                        setCurrentStep(3);
                    }
                }
            });
        }, 100);
    };

    // Handle file change for image upload
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
            if (!validTypes.includes(file.type)) {
                setStepValidationErrors({
                    ...stepValidationErrors,
                    image_arriere_plan: t('developer.messages.invalid_file_type')
                });
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setStepValidationErrors({
                    ...stepValidationErrors,
                    image_arriere_plan: t('developer.messages.file_too_large')
                });
                return;
            }

            // Clear any previous errors
            const newErrors = { ...stepValidationErrors };
            delete newErrors.image_arriere_plan;
            setStepValidationErrors(newErrors);

            // Set the file in the form data
            setData('image_arriere_plan', file);

            // Create a preview URL
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewImage(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Render step indicator
    const renderStepIndicator = () => {
        return (
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    {[1, 2, 3, 4].map((step) => (
                        <div key={step} className="flex flex-col items-center">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                                    currentStep === step
                                        ? 'bg-blue-600'
                                        : currentStep > step
                                            ? 'bg-green-500'
                                            : 'bg-gray-300'
                                }`}
                            >
                                {currentStep > step ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    step
                                )}
                            </div>
                            <div className="text-sm mt-2 text-center">
                                {step === 1 && t('developer.submission.step_1')}
                                {step === 2 && t('developer.submission.step_2')}
                                {step === 3 && t('developer.submission.step_3')}
                                {step === 4 && t('developer.submission.step_4')}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="relative flex items-center justify-between mt-4">
                    <div className="absolute left-0 right-0 h-1 bg-gray-200">
                        <div
                            className="absolute left-0 h-1 bg-blue-600 transition-all duration-300"
                            style={{ width: `${(currentStep - 1) * 33.33}%` }}
                        ></div>
                    </div>
                </div>
            </div>
        );
    };

    // Render current step
    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <BasicInfoStep
                        data={data}
                        setData={setData}
                        errors={errors}
                        stepErrors={stepValidationErrors}
                        rawgEnabled={rawgEnabled}
                    />
                );
            case 2:
                return (
                    <MediaStep
                        data={data}
                        setData={setData}
                        errors={errors}
                        stepErrors={stepValidationErrors}
                        handleFileChange={handleFileChange}
                        previewImage={previewImage}
                        setPreviewImage={setPreviewImage}
                    />
                );
            case 3:
                return (
                    <PlatformsGenresStep
                        data={data}
                        setData={setData}
                        errors={errors}
                        stepErrors={stepValidationErrors}
                        platforms={platforms}
                        genres={genres}
                        tags={tags}
                    />
                );
            case 4:
                return (
                    <ReviewSubmitStep
                        ref={reviewStepRef}
                        data={data}
                        platforms={platforms}
                        genres={genres}
                        tags={tags}
                        previewImage={previewImage}
                        hideVideo={isSubmitting}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <DeveloperLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{t('developer.submission.title')}</h2>}
        >
            <Head title={t('developer.submission.title')} />

            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">{t('developer.submission.title')}</h3>

                    {renderStepIndicator()}

                    <form className="relative">
                        {/* Loading overlay */}
                        {isSubmitting && (
                            <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[9999]" style={{ transition: 'none' }}>
                                <div className="bg-white p-8 rounded-lg shadow-2xl text-center">
                                    <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                </div>
                            </div>
                        )}

                        {renderStep()}

                        <div className="flex justify-between mt-8">
                            {currentStep > 1 && (
                                <SecondaryButton
                                    type="button"
                                    onClick={handlePrevStep}
                                    disabled={processing || isSubmitting}
                                >
                                    {t('developer.submission.back')}
                                </SecondaryButton>
                            )}

                            <div className="ml-auto flex space-x-4">
                                {currentStep < 4 ? (
                                    <PrimaryButton
                                        type="button"
                                        onClick={handleNextStep}
                                        disabled={processing || isSubmitting}
                                    >
                                        {t('developer.submission.continue')}
                                    </PrimaryButton>
                                ) : (
                                    <>
                                        <SecondaryButton
                                            type="button"
                                            onClick={() => handleSubmit(false)}
                                            disabled={processing || isSubmitting}
                                        >
                                            {t('developer.submission.save_draft')}
                                        </SecondaryButton>
                                        <PrimaryButton
                                            type="button"
                                            onClick={() => handleSubmit(true)}
                                            disabled={processing || isSubmitting}
                                        >
                                            {t('developer.submission.submit')}
                                        </PrimaryButton>
                                    </>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </DeveloperLayout>
    );
}
