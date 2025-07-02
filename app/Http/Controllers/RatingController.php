<?php

namespace App\Http\Controllers;

use App\Models\Evaluation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class RatingController extends Controller
{
    /**
     * Create a new controller instance.
     */
    public function __construct()
    {
        $this->middleware(['auth', 'verified']);
    }

    /**
     * Display the user's rating history.
     */
    public function index()
    {
        $user = Auth::user();

        // Get user's ratings with pagination
        $ratings = Evaluation::where('utilisateur_id', $user->id)
            ->with('jeu')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        $ratingItems = $ratings->map(function ($rating) {
            return [
                'id' => $rating->id,
                'game_id' => $rating->jeu_id,
                'game_title' => $rating->jeu ? $rating->jeu->titre : 'Unknown Game',
                'game_image' => $rating->jeu ? $rating->jeu->image_url : null,
                'rating' => $rating->note,
                'comment' => $rating->commentaire,
                'date' => $rating->created_at->diffForHumans(),
                'created_at' => $rating->created_at->format('Y-m-d H:i:s'),
            ];
        });

        // Get rating distribution
        $ratingDistribution = [
            1 => Evaluation::where('utilisateur_id', $user->id)->where('note', '>=', 1)->where('note', '<', 2)->count(),
            2 => Evaluation::where('utilisateur_id', $user->id)->where('note', '>=', 2)->where('note', '<', 3)->count(),
            3 => Evaluation::where('utilisateur_id', $user->id)->where('note', '>=', 3)->where('note', '<', 4)->count(),
            4 => Evaluation::where('utilisateur_id', $user->id)->where('note', '>=', 4)->where('note', '<', 5)->count(),
            5 => Evaluation::where('utilisateur_id', $user->id)->where('note', '>=', 5)->count(),
        ];

        return Inertia::render('User/Ratings', [
            'ratings' => $ratingItems,
            'ratingDistribution' => $ratingDistribution,
            'pagination' => [
                'total' => $ratings->total(),
                'per_page' => $ratings->perPage(),
                'current_page' => $ratings->currentPage(),
                'last_page' => $ratings->lastPage(),
            ],
        ]);
    }

    /**
     * Store a new rating.
     */
    public function store(Request $request)
    {
        $request->validate([
            'game_id' => 'required|exists:jeux,id',
            'rating' => 'required|numeric|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        $user = Auth::user();
        $gameId = $request->input('game_id');

        // Check if the user has already rated this game using our custom method
        $existingRating = Evaluation::findByUserAndGame($user->id, $gameId);

        // Set approval status based on user role
        // Admins and moderators can post without approval
        $isApproved = ($user->role === 'admin' || $user->role === 'moderator');

        // Log the request data
        \Illuminate\Support\Facades\Log::info('Rating request data:', [
            'user_id' => $user->id,
            'user_name' => $user->name,
            'user_email' => $user->email,
            'user_role' => $user->role,
            'game_id' => $gameId,
            'rating' => $request->input('rating'),
            'has_comment' => !empty($request->input('comment')),
        ]);

        // Check if the rating exists and update it, or create a new one
        if ($existingRating) {
            // Log existing rating before update
            \Illuminate\Support\Facades\Log::info('Existing rating found:', [
                'id' => $existingRating->id,
                'user_id' => $existingRating->utilisateur_id,
                'game_id' => $existingRating->jeu_id,
                'is_approved' => $existingRating->is_approved,
                'is_flagged' => $existingRating->is_flagged,
                'has_comment' => !empty($existingRating->commentaire),
            ]);

            // Update existing rating
            $existingRating->note = $request->input('rating');
            $existingRating->commentaire = $request->input('comment');
            $existingRating->is_approved = $isApproved;
            $existingRating->is_flagged = false;
            $existingRating->flag_reason = null;
            $existingRating->save();

            // Log after update
            \Illuminate\Support\Facades\Log::info('Rating updated:', [
                'id' => $existingRating->id,
                'user_id' => $existingRating->utilisateur_id,
                'game_id' => $existingRating->jeu_id,
                'is_approved' => $existingRating->is_approved,
                'is_flagged' => $existingRating->is_flagged,
                'has_comment' => !empty($existingRating->commentaire),
            ]);

            $evaluation = $existingRating;
        } else {
            // Create new rating
            $evaluation = new Evaluation();
            $evaluation->utilisateur_id = $user->id;
            $evaluation->jeu_id = $gameId;
            $evaluation->note = $request->input('rating');
            $evaluation->commentaire = $request->input('comment');
            $evaluation->is_approved = $isApproved;
            $evaluation->is_flagged = false;
            $evaluation->flag_reason = null;
            $evaluation->save();

            // Log after creation
            \Illuminate\Support\Facades\Log::info('New rating created:', [
                'id' => $evaluation->id,
                'user_id' => $evaluation->utilisateur_id,
                'game_id' => $evaluation->jeu_id,
                'is_approved' => $evaluation->is_approved,
                'is_flagged' => $evaluation->is_flagged,
                'has_comment' => !empty($evaluation->commentaire),
            ]);
        }

        // Verify the rating was saved correctly
        $savedRating = Evaluation::findByUserAndGame($user->id, $gameId);
        if ($savedRating) {
            \Illuminate\Support\Facades\Log::info('Rating verification successful:', [
                'id' => $savedRating->id,
                'user_id' => $savedRating->utilisateur_id,
                'game_id' => $savedRating->jeu_id,
                'is_approved' => $savedRating->is_approved,
                'is_flagged' => $savedRating->is_flagged,
                'has_comment' => !empty($savedRating->commentaire),
            ]);
        } else {
            \Illuminate\Support\Facades\Log::error('Rating verification failed: Record not found after save');
        }

        $message = $existingRating ? 'Rating updated successfully.' : 'Rating submitted successfully.';
        return redirect()->back()->with('success', $message);
    }

    /**
     * Show the form for editing a rating.
     */
    public function edit($id)
    {
        $user = Auth::user();
        $rating = Evaluation::findOrFail($id);

        // Ensure the rating belongs to the authenticated user
        if ($rating->utilisateur_id !== $user->id) {
            return redirect()->route('ratings.index')->with('error', 'You are not authorized to edit this rating.');
        }

        return Inertia::render('User/EditRating', [
            'rating' => [
                'id' => $rating->id,
                'game_id' => $rating->jeu_id,
                'game_title' => $rating->jeu ? $rating->jeu->titre : 'Unknown Game',
                'game_image' => $rating->jeu ? $rating->jeu->image_arriere_plan : null,
                'rating' => $rating->note,
                'comment' => $rating->commentaire,
            ],
        ]);
    }

    /**
     * Update an existing rating.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'rating' => 'required|numeric|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        $user = Auth::user();
        $rating = Evaluation::findOrFail($id);

        // Ensure the rating belongs to the authenticated user
        if ($rating->utilisateur_id !== $user->id) {
            return redirect()->back()->with('error', 'You are not authorized to update this rating.');
        }

        // Set approval status based on user role
        // Admins and moderators can post without approval
        $isApproved = ($user->role === 'admin' || $user->role === 'moderator');

        // Update rating
        $rating->note = $request->input('rating');
        $rating->commentaire = $request->input('comment');
        $rating->is_approved = $isApproved;
        $rating->is_flagged = false;
        $rating->flag_reason = null;
        $rating->save();

        // Log the update for debugging
        \Illuminate\Support\Facades\Log::info('Rating updated:', [
            'id' => $rating->id,
            'user_id' => $rating->utilisateur_id,
            'game_id' => $rating->jeu_id,
            'is_approved' => $rating->is_approved,
            'is_flagged' => $rating->is_flagged,
            'has_comment' => !empty($rating->commentaire),
        ]);

        return redirect()->back()->with('success', 'Rating updated successfully.');
    }

    /**
     * Delete a rating.
     */
    public function destroy($id)
    {
        $user = Auth::user();
        $rating = Evaluation::findOrFail($id);

        // Ensure the rating belongs to the authenticated user
        if ($rating->utilisateur_id !== $user->id) {
            return redirect()->back()->with('error', 'You are not authorized to delete this rating.');
        }

        // Delete rating
        $rating->delete();

        return redirect()->back()->with('success', 'Rating deleted successfully.');
    }
}