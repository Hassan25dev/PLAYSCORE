<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;

/**
 * @property-read User $user
 */
class StoreGameRequest extends FormRequest
{
    public function authorize()
    {
        /** @var User $user */
        $user = auth()->user();
        return auth()->check() && ($user->role === 'developer' || $user->is_developer);
    }

    // Définir les règles de validation
    public function rules()
    {
        return [
            'titre' => 'required|string|max:255',
            'description' => 'nullable|string',
            'date_sortie' => 'nullable|date',
            'genre' => 'nullable|string|max:100',
            'plateforme' => 'nullable|string|max:100',
            'rawg_id' => 'nullable|integer|unique:jeux,id', // Pour importer depuis RAWG
        ];
    }

    // Messages d'erreur personnalisés (optionnel)
    public function messages()
    {
        return [
            'titre.required' => __('games.titre_required'),
            'date_sortie.date' => __('games.invalid_date'),
            'rawg_id.unique' => __('games.rawg_id_unique'),
        ];
    }
}