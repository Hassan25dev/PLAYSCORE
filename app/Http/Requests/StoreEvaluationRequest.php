<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreEvaluationRequest extends FormRequest
{
    // Définir qui peut utiliser cette requête
    public function authorize()
    {
        // Seuls les utilisateurs authentifiés peuvent soumettre une évaluation
        return auth()->check();
    }

    // Définir les règles de validation
    public function rules()
    {
        return [
            'jeu_id' => 'required|exists:jeux,id', // The game must exist
            'note' => 'required|integer|min:1|max:5', // La note doit être un entier entre 1 et 5
            'commentaire' => 'nullable|string|max:1000', // Le commentaire est optionnel et limité à 1000 caractères
        ];
    }

    // Messages d'erreur personnalisés (optionnel)
    public function messages()
    {
        return [
            'jeu_id.required' => __('evaluations.game_required'),
            'jeu_id.exists' => __('evaluations.game_not_found'),
            'note.required' => __('evaluations.note_required'),
            'note.min' => __('evaluations.note_min'),
            'note.max' => __('evaluations.note_max'),
            'commentaire.max' => __('evaluations.comment_max_length'),
        ];
    }
}