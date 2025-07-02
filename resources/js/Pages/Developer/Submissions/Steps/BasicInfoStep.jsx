import React, { useState } from 'react';
import { useTranslation } from '../../../../lang/translationHelper';
import InputError from '../../../../Components/InputError';
import InputLabel from '../../../../Components/InputLabel';
import TextInput from '../../../../Components/TextInput';
import TextArea from '../../../../Components/TextArea';
import PrimaryButton from '../../../../Components/PrimaryButton';
import SecondaryButton from '../../../../Components/SecondaryButton';

export default function BasicInfoStep({ data, setData, errors, stepErrors, rawgEnabled }) {
    const { t } = useTranslation();
    const [showRawgSearch, setShowRawgSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searching, setSearching] = useState(false);

    // Handle RAWG search
    const handleRawgSearch = async () => {
        if (!searchQuery.trim()) return;

        setSearching(true);
        try {
            const response = await fetch(`/api/rawg/search?query=${encodeURIComponent(searchQuery)}`);
            const data = await response.json();
            setSearchResults(data.results || []);
        } catch (error) {
            console.error('Error searching RAWG:', error);
            setSearchResults([]);
        } finally {
            setSearching(false);
        }
    };

    // Handle selecting a game from RAWG results
    const handleSelectGame = (game) => {
        setData({
            ...data,
            titre: game.name,
            description: game.description_raw || game.description || '',
            date_sortie: game.released || '',
            rawg_id: game.id,
        });
        setShowRawgSearch(false);
    };

    return (
        <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">{t('developer.submission.step_1')}</h4>

            <div className="mb-6">
                <InputLabel htmlFor="titre" value={t('developer.form.title')} required />
                <TextInput
                    id="titre"
                    type="text"
                    className="mt-1 block w-full"
                    value={data.titre}
                    onChange={(e) => setData('titre', e.target.value)}
                />
                <InputError message={errors.titre || stepErrors.titre} className="mt-2" />
            </div>

            <div className="mb-6">
                <InputLabel htmlFor="description" value={t('developer.form.description')} required />
                <TextArea
                    id="description"
                    className="mt-1 block w-full"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    rows={8}
                />
                <InputError message={errors.description || stepErrors.description} className="mt-2" />
            </div>

            <div className="mb-6">
                <InputLabel htmlFor="date_sortie" value={t('developer.form.release_date')} required />
                <TextInput
                    id="date_sortie"
                    type="date"
                    className="mt-1 block w-full"
                    value={data.date_sortie}
                    onChange={(e) => setData('date_sortie', e.target.value)}
                />
                <InputError message={errors.date_sortie || stepErrors.date_sortie} className="mt-2" />
            </div>

            {data.rawg_id && (
                <div className="mb-6">
                    <InputLabel htmlFor="rawg_id" value={t('developer.form.rawg_id')} />
                    <TextInput
                        id="rawg_id"
                        type="text"
                        className="mt-1 block w-full bg-gray-100"
                        value={data.rawg_id}
                        disabled
                    />
                    <p className="mt-1 text-sm text-gray-500">
                        {t('developer.messages.rawg_id_info')}
                    </p>
                </div>
            )}
        </div>
    );
}
