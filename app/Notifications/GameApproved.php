<?php

namespace App\Notifications;

use App\Models\Jeu;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class GameApproved extends Notification implements ShouldQueue
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
        $url = route('jeux.show', $this->game->id);

        return (new MailMessage)
            ->subject(__('notifications.email.subject.game_approved'))
            ->greeting(__('notifications.email.greeting', ['name' => $notifiable->name]))
            ->line(__('notifications.messages.game_approved', ['game' => $this->game->titre]))
            ->action(__('notifications.types.game_approved'), $url)
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
            'type' => 'game_approved',
            'game_id' => $this->game->id,
            'game_title' => $this->game->titre,
            'message' => 'notifications.messages.game_approved',
            'message_params' => ['game' => $this->game->titre],
            'url' => route('jeux.show', $this->game->id),
            'for_roles' => ['developer'], // This notification is for developers only
        ];
    }
}
