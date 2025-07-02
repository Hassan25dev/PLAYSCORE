<?php

namespace App\Observers;

use App\Models\Evaluation;
use App\Models\User;
use App\Notifications\NewEvaluationSubmission;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;

class EvaluationObserver
{
    /**
     * Handle the Evaluation "created" event.
     */
    public function created(Evaluation $evaluation): void
    {
        Log::info('Evaluation created via observer:', [
            'user_id' => $evaluation->utilisateur_id,
            'game_id' => $evaluation->jeu_id,
            'rating' => $evaluation->note,
            'has_comment' => !empty($evaluation->commentaire),
            'is_approved' => $evaluation->is_approved,
            'is_flagged' => $evaluation->is_flagged,
        ]);

        // If the evaluation has a comment and needs approval, notify admins
        if (!empty($evaluation->commentaire) && !$evaluation->is_approved && !$evaluation->is_flagged) {
            try {
                // Notify admins about the new evaluation with comment
                $admins = User::where('role', 'admin')->get();
                if ($admins->count() > 0) {
                    // Send notification to admins about the new evaluation with comment
                    Notification::send($admins, new NewEvaluationSubmission($evaluation));
                    Log::info('Notifications sent to ' . $admins->count() . ' admins for evaluation: ' . $evaluation->utilisateur_id . '_' . $evaluation->jeu_id);
                } else {
                    Log::warning('No admins found to notify about new evaluation: ' . $evaluation->utilisateur_id . '_' . $evaluation->jeu_id);
                }
            } catch (\Exception $e) {
                // Log the error but don't fail the request
                Log::error('Failed to process evaluation notification via observer: ' . $e->getMessage());
            }
        }
    }

    /**
     * Handle the Evaluation "updated" event.
     */
    public function updated(Evaluation $evaluation): void
    {
        Log::info('Evaluation updated via observer:', [
            'user_id' => $evaluation->utilisateur_id,
            'game_id' => $evaluation->jeu_id,
            'rating' => $evaluation->note,
            'has_comment' => !empty($evaluation->commentaire),
            'is_approved' => $evaluation->is_approved,
            'is_flagged' => $evaluation->is_flagged,
        ]);
    }

    /**
     * Handle the Evaluation "deleted" event.
     */
    public function deleted(Evaluation $evaluation): void
    {
        Log::info('Evaluation deleted via observer:', [
            'user_id' => $evaluation->utilisateur_id,
            'game_id' => $evaluation->jeu_id,
        ]);
    }

    /**
     * Handle the Evaluation "restored" event.
     */
    public function restored(Evaluation $evaluation): void
    {
        Log::info('Evaluation restored via observer:', [
            'user_id' => $evaluation->utilisateur_id,
            'game_id' => $evaluation->jeu_id,
        ]);
    }

    /**
     * Handle the Evaluation "force deleted" event.
     */
    public function forceDeleted(Evaluation $evaluation): void
    {
        Log::info('Evaluation force deleted via observer:', [
            'user_id' => $evaluation->utilisateur_id,
            'game_id' => $evaluation->jeu_id,
        ]);
    }
}
