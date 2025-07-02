<?php

namespace App\Notifications;

use App\Models\Jeu;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class GameUnderReview extends Notification implements ShouldQueue
{
    use Queueable;

    protected $game;

    /**
     * Create a new notification instance.
     */
    public function __construct(Jeu $game)
    {
        $this->game = $game;
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
        $url = route('game-submissions.show', $this->game->id);

        return (new MailMessage)
            ->subject('Game Under Review: ' . $this->game->titre)
            ->greeting('Hello ' . $notifiable->name . ',')
            ->line('Your game "' . $this->game->titre . '" is now being reviewed by our team.')
            ->line('We will notify you once the review process is complete.')
            ->action('View Submission', $url)
            ->line('Thank you for your patience.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'game_under_review',
            'game_id' => $this->game->id,
            'game_title' => $this->game->titre,
            'message' => 'notifications.messages.game_under_review',
            'message_params' => ['game' => $this->game->titre],
            'url' => route('game-submissions.show', $this->game->id),
            'for_roles' => ['developer'], // This notification is for developers only
        ];
    }
}
