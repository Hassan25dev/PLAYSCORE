<?php

namespace App\Notifications;

use App\Models\Evaluation;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewEvaluationSubmission extends Notification implements ShouldQueue
{
    use Queueable;

    protected $evaluation;

    /**
     * Create a new notification instance.
     */
    public function __construct(Evaluation $evaluation)
    {
        $this->evaluation = $evaluation;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $url = route('admin.review-moderation.show', $this->evaluation->utilisateur_id . '_' . $this->evaluation->jeu_id);

        return (new MailMessage)
            ->subject('New Evaluation Submission')
            ->greeting('Hello ' . $notifiable->name . ',')
            ->line('A new evaluation with comment has been submitted and is pending approval.')
            ->line('Game: ' . $this->evaluation->jeu->titre)
            ->line('User: ' . $this->evaluation->utilisateur->name)
            ->line('Rating: ' . $this->evaluation->note . '/5')
            ->line('Comment: ' . substr($this->evaluation->commentaire, 0, 100) . (strlen($this->evaluation->commentaire) > 100 ? '...' : ''))
            ->action('Review Evaluation', $url)
            ->line('Thank you for using our application!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'evaluation_submission',
            'evaluation_id' => $this->evaluation->utilisateur_id . '_' . $this->evaluation->jeu_id,
            'game_id' => $this->evaluation->jeu_id,
            'game_title' => $this->evaluation->jeu->titre,
            'user_id' => $this->evaluation->utilisateur_id,
            'user_name' => $this->evaluation->utilisateur->name,
            'rating' => $this->evaluation->note,
            'message' => 'notifications.messages.new_evaluation_submission',
            'message_params' => [
                'game' => $this->evaluation->jeu->titre,
                'user' => $this->evaluation->utilisateur->name
            ],
            'url' => route('admin.review-moderation.show', $this->evaluation->utilisateur_id . '_' . $this->evaluation->jeu_id),
            'for_roles' => ['admin'], // This notification is for admins only
        ];
    }
}
