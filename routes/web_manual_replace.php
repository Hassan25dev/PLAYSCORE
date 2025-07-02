<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use App\Mail\TestEmail;
use App\Models\Evaluation;

Route::get('/debug-email-verification', function () {
    $user = Auth::user();
    if (!$user) {
        return response()->json(['message' => 'No authenticated user'], 401);
    }
    return response()->json([
        'email_verified_at' => $user->email_verified_at,
        'hasVerifiedEmail' => method_exists($user, 'hasVerifiedEmail') && is_callable([$user, 'hasVerifiedEmail']) ? call_user_func([$user, 'hasVerifiedEmail']) : false,
    ]);
})->middleware('auth');

// Debug route to check reviews
Route::get('/debug-reviews', function () {
    $reviews = Evaluation::with(['utilisateur', 'jeu'])->get();
    return response()->json([
        'count' => $reviews->count(),
        'reviews' => $reviews->map(function ($review) {
            return [
                'id' => $review->id,
                'user' => $review->utilisateur ? $review->utilisateur->name : null,
                'game' => $review->jeu ? $review->jeu->titre : null,
                'rating' => $review->note,
                'comment' => $review->commentaire,
            ];
        }),
    ]);
});

Route::get('/send-test-email', function () {
    $user = Auth::user();
    if (!$user) {
        return response()->json(['message' => 'No authenticated user'], 401);
    }
    Mail::to($user->email)->send(new TestEmail());
    return response()->json(['message' => 'Test email sent']);
})->middleware('auth');
