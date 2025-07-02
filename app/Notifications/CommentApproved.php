<?php

namespace App\Notifications;

use App\Models\Comment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CommentApproved extends Notification implements ShouldQueue
{
    use Queueable;

    protected $comment;

    /**
     * Create a new notification instance.
     */
    public function __construct(Comment $comment)
    {
        $this->comment = $comment;
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
        $url = route('jeux.show', $this->comment->jeu_id) . '#comment-' . $this->comment->id;

        return (new MailMessage)
            ->subject(__('notifications.email.subject.comment_approved'))
            ->greeting(__('notifications.email.greeting', ['name' => $notifiable->name]))
            ->line(__('notifications.messages.comment_approved', ['game' => $this->comment->jeu->titre]))
            ->action(__('notifications.types.comment_approved'), $url)
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
            'type' => 'comment_approved',
            'comment_id' => $this->comment->id,
            'game_id' => $this->comment->jeu_id,
            'game_title' => $this->comment->jeu->titre,
            'message' => 'notifications.messages.comment_approved',
            'message_params' => ['game' => $this->comment->jeu->titre],
            'url' => route('jeux.show', $this->comment->jeu_id) . '#comment-' . $this->comment->id,
            'for_roles' => ['user'], // This notification is for users only
        ];
    }
}
