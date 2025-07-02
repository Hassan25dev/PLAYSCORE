<?php

namespace App\Notifications;

use App\Models\Evaluation;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class EvaluationApproved extends Notification implements ShouldQueue
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
        $url = route('jeux.show', $this->evaluation->jeu_id) . '#evaluation-' . $this->evaluation->utilisateur_id . '-' . $this->evaluation->jeu_id;

        return (new MailMessage)
            ->subject(__('notifications.email.subject.evaluation_approved'))
            ->greeting(__('notifications.email.greeting', ['name' => $notifiable->name]))
            ->line(__('notifications.messages.evaluation_approved', ['game' => $this->evaluation->jeu->titre]))
            ->action(__('notifications.types.evaluation_approved'), $url)
            ->line(__('notifications.email.footer'));
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'evaluation_approved',
            'evaluation_id' => $this->evaluation->utilisateur_id . '_' . $this->evaluation->jeu_id,
            'game_id' => $this->evaluation->jeu_id,
            'game_title' => $this->evaluation->jeu->titre,
            'message' => 'notifications.messages.evaluation_approved',
            'message_params' => ['game' => $this->evaluation->jeu->titre],
            'url' => route('jeux.show', $this->evaluation->jeu_id) . '#evaluation-' . $this->evaluation->utilisateur_id . '-' . $this->evaluation->jeu_id,
        ];
    }
}
