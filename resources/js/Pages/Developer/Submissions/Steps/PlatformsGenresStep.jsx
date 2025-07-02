import React from 'react';
import { useTranslation } from '../../../../lang/translationHelper';
import InputError from '../../../../components/InputError';
import InputLabel from '../../../../Components/InputLabel';
import Checkbox from '../../../../Components/Checkbox';

export default function PlatformsGenresStep({ data, setData, errors, stepErrors, platforms, genres, tags }) {
    const { t } = useTranslation();

    // Handle platform selection
    const handlePlatformChange = (platformId) => {
        const currentPlatforms = [...data.plateforme_ids];
        
        if (currentPlatforms.includes(platformId)) {
            setData('plateforme_ids', currentPlatforms.filter(id => id !== platformId));
        } else {
            setData('plateforme_ids', [...currentPlatforms, platformId]);
        }
    };

    // Handle genre selection
    const handleGenreChange = (genreId) => {
        const currentGenres = [...data.genre_ids];
        
        if (currentGenres.includes(genreId)) {
            setData('genre_ids', currentGenres.filter(id => id !== genreId));
        } else {
            setData('genre_ids', [...currentGenres, genreId]);
        }
    };

    // Handle tag selection
    const handleTagChange = (tagId) => {
        const currentTags = [...data.tag_ids];
        
        if (currentTags.includes(tagId)) {
            setData('tag_ids', currentTags.filter(id => id !== tagId));
        } else {
            setData('tag_ids', [...currentTags, tagId]);
        }
    };

    return (
        <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">{t('developer.submission.step_3')}</h4>
            
            <div className="mb-6">
                <InputLabel value={t('developer.form.platforms')} required />
                
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {platforms.map((platform) => (
                        <div key={platform.id} className="flex items-center">
                            <Checkbox
                                name={`platform_${platform.id}`}
                                checked={data.plateforme_ids.includes(platform.id)}
                                onChange={() => handlePlatformChange(platform.id)}
                            />
                            <label htmlFor={`platform_${platform.id}`} className="ml-2 text-sm text-gray-700">
                                {platform.nom}
                            </label>
                        </div>
                    ))}
                </div>
                
                <InputError message={errors.plateforme_ids || stepErrors.plateforme_ids} className="mt-2" />
            </div>
            
            <div className="mb-6">
                <InputLabel value={t('developer.form.genres')} required />
                
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {genres.map((genre) => (
                        <div key={genre.id} className="flex items-center">
                            <Checkbox
                                name={`genre_${genre.id}`}
                                checked={data.genre_ids.includes(genre.id)}
                                onChange={() => handleGenreChange(genre.id)}
                            />
                            <label htmlFor={`genre_${genre.id}`} className="ml-2 text-sm text-gray-700">
                                {genre.nom}
                            </label>
                        </div>
                    ))}
                </div>
                
                <InputError message={errors.genre_ids || stepErrors.genre_ids} className="mt-2" />
            </div>
            
            <div className="mb-6">
                <InputLabel value={t('developer.form.tags')} />
                <p className="text-sm text-gray-500 mb-2">{t('developer.messages.tags_optional')}</p>
                
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {tags.map((tag) => (
                        <div key={tag.id} className="flex items-center">
                            <Checkbox
                                name={`tag_${tag.id}`}
                                checked={data.tag_ids.includes(tag.id)}
                                onChange={() => handleTagChange(tag.id)}
                            />
                            <label htmlFor={`tag_${tag.id}`} className="ml-2 text-sm text-gray-700">
                                {tag.nom}
                            </label>
                        </div>
                    ))}
                </div>
                
                <InputError message={errors.tag_ids} className="mt-2" />
            </div>
        </div>
    );
}
