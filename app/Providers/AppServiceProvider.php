<?php

namespace App\Providers;

use App\Models\Comment;
use App\Models\Evaluation;
use App\Observers\CommentObserver;
use App\Observers\EvaluationObserver;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Register the Comment observer
        Comment::observe(CommentObserver::class);

        // Register the Evaluation observer
        Evaluation::observe(EvaluationObserver::class);
    }
}
