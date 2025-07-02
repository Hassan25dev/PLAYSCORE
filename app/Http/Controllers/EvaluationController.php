<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreEvaluationRequest;
use App\Models\Evaluation;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class EvaluationController extends Controller
{
    public function store(StoreEvaluationRequest $request)
    {
        $validated = $request->validated();
        $user = Auth::user();

        // Log the request data
        Log::info('Evaluation request data:', [
            'user_id' => $user->id,
            'user_name' => $user->name,
            'user_email' => $user->email,
            'user_role' => $user->role,
            'jeu_id' => $validated['jeu_id'],
            'note' => $validated['note'],
            'has_comment' => !empty($validated['commentaire']),
        ]);

        // Set approval status based on user role
        // Admins and moderators can post without approval
        $isApproved = ($user->role === 'admin' || $user->role === 'moderator');

        // Check if the evaluation exists using our custom method
        $existingEvaluation = Evaluation::findByUserAndGame(auth()->id(), $validated['jeu_id']);

        if ($existingEvaluation) {
            // Log existing evaluation before update
            Log::info('Existing evaluation found:', [
                'id' => $existingEvaluation->id,
                'user_id' => $existingEvaluation->utilisateur_id,
                'game_id' => $existingEvaluation->jeu_id,
                'is_approved' => $existingEvaluation->is_approved,
                'is_flagged' => $existingEvaluation->is_flagged,
                'has_comment' => !empty($existingEvaluation->commentaire),
            ]);

            // Update existing evaluation
            $existingEvaluation->note = $validated['note'];
            $existingEvaluation->commentaire = $validated['commentaire'];
            $existingEvaluation->is_approved = $isApproved;
            $existingEvaluation->is_flagged = false;
            $existingEvaluation->flag_reason = null;
            $existingEvaluation->save();
            $evaluation = $existingEvaluation;
        } else {
            // Create new evaluation
            $evaluation = new Evaluation();
            $evaluation->utilisateur_id = auth()->id();
            $evaluation->jeu_id = $validated['jeu_id'];
            $evaluation->note = $validated['note'];
            $evaluation->commentaire = $validated['commentaire'];
            $evaluation->is_approved = $isApproved;
            $evaluation->is_flagged = false;
            $evaluation->flag_reason = null;
            $evaluation->save();
        }

        // Log after save
        Log::info('Evaluation created/updated:', [
            'id' => $evaluation->id,
            'user_id' => $evaluation->utilisateur_id,
            'game_id' => $evaluation->jeu_id,
            'is_approved' => $evaluation->is_approved,
            'is_flagged' => $evaluation->is_flagged,
            'has_comment' => !empty($evaluation->commentaire),
            'comment_length' => $evaluation->commentaire ? strlen($evaluation->commentaire) : 0,
        ]);

        // Verify the evaluation was saved correctly
        $savedEvaluation = Evaluation::findByUserAndGame(auth()->id(), $validated['jeu_id']);
        if ($savedEvaluation) {
            Log::info('Evaluation verification successful:', [
                'id' => $savedEvaluation->id,
                'user_id' => $savedEvaluation->utilisateur_id,
                'game_id' => $savedEvaluation->jeu_id,
                'is_approved' => $savedEvaluation->is_approved,
                'is_flagged' => $savedEvaluation->is_flagged,
                'has_comment' => !empty($savedEvaluation->commentaire),
            ]);

            // Call stored procedure to update game statistics
            //\Illuminate\Support\Facades\DB::statement("CALL UpdateGameStatistics(?)", [$validated['jeu_id']]);
        } else {
            Log::error('Evaluation verification failed: Record not found after save');
        }

        return redirect()->back()->with('success', __('evaluations.saved_success'));
    }
}
