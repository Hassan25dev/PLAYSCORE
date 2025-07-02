<?php

namespace App\Observers;

use App\Models\Comment;
use App\Models\User;
use App\Notifications\NewCommentSubmission;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;

class CommentObserver
{
    /**
     * Handle the Comment "created" event.
     */
    public function created(Comment $comment): void
    {
        Log::info('Comment created via observer:', [
            'id' => $comment->id,
            'user_id' => $comment->user_id,
            'game_id' => $comment->jeu_id,
            'is_approved' => $comment->is_approved,
            'is_flagged' => $comment->is_flagged,
        ]);

        // If the comment needs approval, notify admins
        if (!$comment->is_approved && !$comment->is_flagged) {
            try {
                // Notify admins about the new comment
                $admins = User::where('role', 'admin')->get();
                if ($admins->count() > 0) {
                    Notification::send($admins, new NewCommentSubmission($comment));
                    Log::info('Notifications sent via observer to ' . $admins->count() . ' admins for comment: ' . $comment->id);
                } else {
                    Log::warning('No admins found to notify about new comment: ' . $comment->id);
                }
            } catch (\Exception $e) {
                // Log the error but don't fail the request
                Log::error('Failed to send notifications for comment submission via observer: ' . $e->getMessage());
            }
        }
    }

    /**
     * Handle the Comment "updated" event.
     */
    public function updated(Comment $comment): void
    {
        Log::info('Comment updated via observer:', [
            'id' => $comment->id,
            'user_id' => $comment->user_id,
            'game_id' => $comment->jeu_id,
            'is_approved' => $comment->is_approved,
            'is_flagged' => $comment->is_flagged,
        ]);
    }

    /**
     * Handle the Comment "deleted" event.
     */
    public function deleted(Comment $comment): void
    {
        Log::info('Comment deleted via observer:', [
            'id' => $comment->id,
            'user_id' => $comment->user_id,
            'game_id' => $comment->jeu_id,
        ]);
    }

    /**
     * Handle the Comment "restored" event.
     */
    public function restored(Comment $comment): void
    {
        Log::info('Comment restored via observer:', [
            'id' => $comment->id,
            'user_id' => $comment->user_id,
            'game_id' => $comment->jeu_id,
        ]);
    }

    /**
     * Handle the Comment "force deleted" event.
     */
    public function forceDeleted(Comment $comment): void
    {
        Log::info('Comment force deleted via observer:', [
            'id' => $comment->id,
            'user_id' => $comment->user_id,
            'game_id' => $comment->jeu_id,
        ]);
    }
}
