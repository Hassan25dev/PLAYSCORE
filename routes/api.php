<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EvaluationController;
use App\Http\Controllers\GenreController;
use App\Http\Controllers\PlatformController;

// User Authentication Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);

// Game Management Routes
use App\Http\Controllers\JeuController;

Route::get('/games', [JeuController::class, 'index']);
Route::get('/games/{jeu}', [JeuController::class, 'show']);
Route::get('/games/{jeu}/pdf', [JeuController::class, 'generatePDF']);
Route::get('/games/{jeu}/xml', [App\Http\Controllers\XmlController::class, 'exportGame']);
Route::get('/user/games/{jeu}/xml', [App\Http\Controllers\XmlController::class, 'exportGame'])->middleware(['auth:sanctum']);
Route::get('/genres', [GenreController::class, 'index']);
Route::get('/platforms', [PlatformController::class, 'index']);
Route::post('/games', [JeuController::class, 'store'])->middleware('auth:sanctum');

// Evaluation Routes
Route::post('/evaluations', [EvaluationController::class, 'store'])->middleware('auth:sanctum');
Route::put('/evaluations/{evaluation}', [EvaluationController::class, 'update'])->middleware('auth:sanctum');
Route::delete('/evaluations/{evaluation}', [EvaluationController::class, 'destroy'])->middleware('auth:sanctum');

// Chart Data Routes
Route::get('/charts/user-activity', [App\Http\Controllers\ChartController::class, 'userActivityData'])->middleware('auth:sanctum');

// XML Import/Export Routes for admin and developer
Route::middleware(['auth', 'role:developer,admin'])->group(function () {
    Route::get('/user/export-xml', [App\Http\Controllers\XmlController::class, 'exportUserData']);
    Route::post('/user/import-xml', [App\Http\Controllers\XmlController::class, 'importXml']);
    Route::get('/developer/games/{jeu}/xml', [App\Http\Controllers\XmlController::class, 'exportGame']);
    Route::get('/admin/games/{jeu}/xml', [App\Http\Controllers\XmlController::class, 'exportGame']);

    // Route to check if user is authenticated and has correct role
    Route::get('/xml/check-auth', function () {
        return response()->json([
            'authenticated' => true,
            'user' => [
                'id' => auth()->user()->id,
                'name' => auth()->user()->name,
                'email' => auth()->user()->email,
                'role' => auth()->user()->role
            ],
            'message' => 'User is authenticated and has the correct role'
        ]);
    });
});

// RAWG API Routes
Route::prefix('rawg')->group(function () {
    Route::get('/search', [App\Http\Controllers\Api\RawgController::class, 'search']);
    Route::get('/games/{id}', [App\Http\Controllers\Api\RawgController::class, 'getGame']);
    Route::get('/games', [App\Http\Controllers\Api\RawgController::class, 'getGames']);
    Route::get('/debug', [App\Http\Controllers\Api\RawgController::class, 'debugRawgApi']);
    Route::get('/clear-cache', [App\Http\Controllers\Api\RawgController::class, 'clearCache']);
    Route::get('/clear-cache', [App\Http\Controllers\Api\RawgController::class, 'clearCache']);
});
