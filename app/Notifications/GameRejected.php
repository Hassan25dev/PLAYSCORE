<?php

namespace App\Notifications;

use App\Models\Jeu;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class GameRejected extends Notification implements ShouldQueue
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
        $url = route('developer.games.details', $this->game->id);

        return (new MailMessage)
            ->subject(__('notifications.email.subject.game_rejected'))
            ->greeting(__('notifications.email.greeting', ['name' => $notifiable->name]))
            ->line(__('notifications.messages.game_rejected', ['game' => $this->game->titre]))
            ->line($this->game->feedback ? 'Feedback: ' . $this->game->feedback : '')
            ->action(__('notifications.types.game_rejected'), $url)
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
            'type' => 'game_rejected',
            'game_id' => $this->game->id,
            'game_title' => $this->game->titre,
            'feedback' => $this->game->feedback,
            'message' => 'notifications.messages.game_rejected',
            'message_params' => ['game' => $this->game->titre],
            'url' => route('developer.games.details', $this->game->id),
            'for_roles' => ['developer'], // This notification is for developers only
        ];
    }
}
