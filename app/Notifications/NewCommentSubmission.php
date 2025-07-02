<?php

namespace App\Notifications;

use App\Models\Comment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewCommentSubmission extends Notification implements ShouldQueue
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
        $url = route('admin.comment-moderation.show', $this->comment->id);

        return (new MailMessage)
            ->subject(__('notifications.email.subject.comment_submission'))
            ->greeting(__('notifications.email.greeting', ['name' => $notifiable->name]))
            ->line(__('notifications.messages.comment_submission', [
                'game' => $this->comment->jeu->titre,
                'user' => $this->comment->user->name
            ]))
            ->line(__('comments.comment') . ': ' . substr($this->comment->content, 0, 100) . (strlen($this->comment->content) > 100 ? '...' : ''))
            ->action(__('notifications.actions.view'), $url)
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
            'id' => $this->comment->id,
            'type' => 'comment_submission',
            'game_id' => $this->comment->jeu_id,
            'game_title' => $this->comment->jeu->titre,
            'user_id' => $this->comment->user_id,
            'user_name' => $this->comment->user->name,
            'message' => 'notifications.messages.comment_submission',
            'message_params' => [
                'game' => $this->comment->jeu->titre,
                'user' => $this->comment->user->name
            ],
            'url' => route('admin.comment-moderation.show', $this->comment->id),
            'for_roles' => ['admin'], // This notification is for admins only
        ];
    }
}
