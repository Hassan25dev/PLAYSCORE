import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { useTranslation } from '../../lang/translationHelper';
import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';
import TextArea from '@/Components/TextArea';
import PrimaryButton from '@/Components/PrimaryButton';

export default function EditRating({ auth, rating }) {
    const { t } = useTranslation();
    const [hoveredStar, setHoveredStar] = useState(0);
    
    const { data, setData, put, processing, errors } = useForm({
        rating: rating.rating,
        comment: rating.comment || '',
    });
    
    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('ratings.update', rating.id));
    };
    
    const renderStars = () => {
        return (
            <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHoveredStar(star)}
                        onMouseLeave={() => setHoveredStar(0)}
                        onClick={() => setData('rating', star)}
                        className="focus:outline-none"
                    >
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className={`h-8 w-8 ${
                                star <= (hoveredStar || data.rating) 
                                    ? 'text-yellow-500' 
                                    : 'text-gray-300'
                            } transition-colors duration-150`}
                            viewBox="0 0 20 20" 
                            fill="currentColor"
                        >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                    </button>
                ))}
                <span className="ml-2 text-lg font-medium text-gray-700">{data.rating}/5</span>
            </div>
        );
    };

    return (
        <MainLayout auth={auth} currentUrl="/ratings">
            <Head title={t('ratings.edit_rating') || 'Edit Rating'} />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="p-6">
                            <h2 className="text-2xl font-semibold text-gray-800 flex items-center mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-2 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                                {t('ratings.edit_rating') || 'Edit Rating'}
                            </h2>
                            
                            <div className="flex flex-col md:flex-row gap-6 mb-6">
                                <div className="md:w-1/3">
                                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                                        <img 
                                            src={rating.game_image || 'https://via.placeholder.com/300x200?text=No+Image'} 
                                            alt={rating.game_title} 
                                            className="w-full h-48 object-cover"
                                        />
                                        <div className="p-4">
                                            <h3 className="text-lg font-semibold text-gray-800">{rating.game_title}</h3>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="md:w-2/3">
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                {t('ratings.your_rating') || 'Your Rating'}
                                            </label>
                                            {renderStars()}
                                            <InputError message={errors.rating} className="mt-2" />
                                        </div>
                                        
                                        <div>
                                            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                                                {t('ratings.your_review') || 'Your Review'} ({t('ratings.optional') || 'Optional'})
                                            </label>
                                            <TextArea
                                                id="comment"
                                                value={data.comment}
                                                onChange={(e) => setData('comment', e.target.value)}
                                                className="w-full"
                                                rows={5}
                                                placeholder={t('ratings.write_review_placeholder') || 'Write your thoughts about this game...'}
                                            />
                                            <InputError message={errors.comment} className="mt-2" />
                                        </div>
                                        
                                        <div className="flex justify-end space-x-2">
                                            <a
                                                href={route('ratings.index')}
                                                className="inline-flex items-center px-4 py-2 bg-gray-200 border border-transparent rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest hover:bg-gray-300 active:bg-gray-400 focus:outline-none focus:border-gray-500 focus:ring ring-gray-300 disabled:opacity-25 transition"
                                            >
                                                {t('common.cancel') || 'Cancel'}
                                            </a>
                                            <PrimaryButton processing={processing}>
                                                {t('common.save') || 'Save Changes'}
                                            </PrimaryButton>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
