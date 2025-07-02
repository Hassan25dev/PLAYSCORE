<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;

class UpdateGameRequest extends FormRequest
{
    public function authorize()
    {
        // Seuls les utilisateurs authentifiés avec le rôle "développeur" peuvent mettre à jour un jeu
        /** @var User $user */
        $user = auth()->user();
        return auth()->check() && ($user->role === 'developer' || $user->is_developer);
    }

    public function rules()
    {
        return [
            'titre' => 'required|string|max:255',
            'description' => 'nullable|string',
            'date_sortie' => 'nullable|date',
            'genre' => 'nullable|string|max:100',
            'plateforme' => 'nullable|string|max:100',
        ];
    }

    public function messages()
    {
        return [
            'titre.required' => __('jeux.titre_required'),
            'date_sortie.date' => __('jeux.invalid_date'),
        ];
    }
}