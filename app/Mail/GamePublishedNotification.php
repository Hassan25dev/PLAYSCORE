<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class GamePublishedNotification extends Mailable
{
    use Queueable, SerializesModels;

    public $game;

    public function __construct($game)
    {
        $this->game = $game;
    }

    public function build()
    {
        return $this->subject(__('emails.subject_game_published')) // Utilisation de la traduction
                    ->view('emails.game_published');
    }
}