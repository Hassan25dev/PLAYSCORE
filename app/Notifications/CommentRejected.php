<?php

namespace App\Notifications;

use App\Models\Comment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CommentRejected extends Notification implements ShouldQueue
{
    use Queueable;

    protected $comment;
    protected $reason;

    /**
     * Create a new notification instance.
     */
    public function __construct(Comment $comment, $reason = null)
    {
        $this->comment = $comment;
        $this->reason = $reason;
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
        $mail = (new MailMessage)
            ->subject(__('notifications.email.subject.comment_rejected'))
            ->greeting(__('notifications.email.greeting', ['name' => $notifiable->name]))
            ->line(__('notifications.messages.comment_rejected', ['game' => $this->comment->jeu->titre]));

        if ($this->reason) {
            $mail->line('Reason: ' . $this->reason);
        }

        return $mail->line(__('notifications.email.footer'));
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'comment_rejected',
            'comment_id' => $this->comment->id,
            'game_id' => $this->comment->jeu_id,
            'game_title' => $this->comment->jeu->titre,
            'reason' => $this->reason,
            'message' => 'notifications.messages.comment_rejected',
            'message_params' => ['game' => $this->comment->jeu->titre],
            'for_roles' => ['user'], // This notification is for users only
        ];
    }
}
