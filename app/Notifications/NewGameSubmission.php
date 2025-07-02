<?php

namespace App\Notifications;

use App\Models\Jeu;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewGameSubmission extends Notification implements ShouldQueue
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
        $url = route('admin.game-approvals.show', $this->game->id);

        return (new MailMessage)
            ->subject('New Game Submission: ' . $this->game->titre)
            ->greeting('Hello ' . $notifiable->name . ',')
            ->line('A new game has been submitted for approval: "' . $this->game->titre . '"')
            ->line('Developer: ' . $this->game->developpeur->name)
            ->action('Review Game', $url)
            ->line('Thank you for your attention to this matter.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'new_game_submission',
            'game_id' => $this->game->id,
            'game_title' => $this->game->titre,
            'developer_name' => $this->game->developpeur->name,
            'message' => 'notifications.messages.new_game_submission',
            'message_params' => [
                'game' => $this->game->titre,
                'developer' => $this->game->developpeur->name
            ],
            'url' => route('admin.game-approvals.show', $this->game->id),
            'for_roles' => ['admin'], // This notification is for admins only
        ];
    }
}
