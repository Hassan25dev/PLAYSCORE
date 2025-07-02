<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Illuminate\Notifications\DatabaseNotification;
use App\Models\User;

class NotificationController extends Controller
{
    /**
     * Create a new controller instance.
     */
    public function __construct()
    {
        $this->middleware(['auth', 'verified']);
    }

    /**
     * Display a listing of the user's notifications.
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $role = $request->query('role', null);

        // Log the user and role for debugging
        Log::info('Fetching notifications for user', [
            'user_id' => $user->id,
            'user_name' => $user->name,
            'user_role' => $user->role,
            'requested_role' => $role
        ]);

        // Get the base query for notifications
        $query = DatabaseNotification::where('notifiable_id', $user->id)
                                    ->where('notifiable_type', get_class($user))
                                    ->orderBy('created_at', 'desc');

        // Filter notifications based on role if provided
        if ($role) {
            $query->where(function($q) use ($role) {
                $q->whereJsonContains('data->for_roles', $role)
                  ->orWhereRaw("JSON_EXTRACT(data, '$.for_roles') IS NULL") // Include notifications with null for_roles
                  ->orWhereRaw("JSON_TYPE(JSON_EXTRACT(data, '$.for_roles')) = 'NULL'") // Include notifications with JSON null for_roles
                  ->orWhereRaw("JSON_LENGTH(JSON_EXTRACT(data, '$.for_roles')) = 0") // Include notifications with empty for_roles array
                  ->orWhereRaw("JSON_EXTRACT(data, '$.for_roles') = '[]'") // Include notifications with empty JSON array
                  ->orWhereRaw("NOT JSON_CONTAINS(data, JSON_ARRAY(?), '$.for_roles')", [$role]); // Include notifications not specifically restricted from this role

                // Log the SQL query for debugging
                Log::info('Notification query SQL: ' . $q->toSql());
                Log::info('Notification query bindings: ' . json_encode($q->getBindings()));
            });
        }

        $notifications = $query->paginate(10);
        $unreadCount = DatabaseNotification::where('notifiable_id', $user->id)
                                          ->where('notifiable_type', get_class($user))
                                          ->whereNull('read_at')
                                          ->count();

        // Log the notifications for debugging
        Log::info('Notifications fetched', [
            'count' => $notifications->count(),
            'first_few' => $notifications->take(3)->toArray()
        ]);

        return response()->json([
            'notifications' => $notifications,
            'unreadCount' => $unreadCount,
        ]);
    }

    /**
     * Display all notifications page.
     */
    public function all()
    {
        $user = Auth::user();
        $role = null;

        // Determine the user's role
        if ($user->role === 'admin') {
            $role = 'admin';
        } elseif ($user->role === 'developer' || $user->is_developer) {
            $role = 'developer';
        } else {
            $role = 'user';
        }

        // Log the user and role for debugging
        Log::info('Viewing all notifications for user', [
            'user_id' => $user->id,
            'user_name' => $user->name,
            'user_role' => $user->role,
            'determined_role' => $role
        ]);

        // Get the base query for notifications
        $query = DatabaseNotification::where('notifiable_id', $user->id)
                                    ->where('notifiable_type', get_class($user))
                                    ->orderBy('created_at', 'desc');

        // Filter notifications based on role
        $query->where(function($q) use ($role) {
            $q->whereJsonContains('data->for_roles', $role)
              ->orWhereRaw("JSON_EXTRACT(data, '$.for_roles') IS NULL") // Include notifications with null for_roles
              ->orWhereRaw("JSON_TYPE(JSON_EXTRACT(data, '$.for_roles')) = 'NULL'") // Include notifications with JSON null for_roles
              ->orWhereRaw("JSON_LENGTH(JSON_EXTRACT(data, '$.for_roles')) = 0") // Include notifications with empty for_roles array
              ->orWhereRaw("JSON_EXTRACT(data, '$.for_roles') = '[]'") // Include notifications with empty JSON array
              ->orWhereRaw("NOT JSON_CONTAINS(data, JSON_ARRAY(?), '$.for_roles')", [$role]); // Include notifications not specifically restricted from this role

            // Log the SQL query for debugging
            Log::info('All notifications query SQL: ' . $q->toSql());
            Log::info('All notifications query bindings: ' . json_encode($q->getBindings()));
        });

        $notifications = $query->paginate(10);

        // Log the notifications for debugging
        Log::info('All notifications fetched', [
            'count' => $notifications->count(),
            'first_few' => $notifications->take(3)->toArray()
        ]);

        return Inertia::render('Notifications/Index', [
            'notifications' => $notifications,
        ]);
    }

    /**
     * Mark a notification as read.
     */
    public function markAsRead($id)
    {
        $user = Auth::user();
        $notification = DatabaseNotification::where('id', $id)
                                          ->where('notifiable_id', $user->id)
                                          ->where('notifiable_type', get_class($user))
                                          ->firstOrFail();
        $notification->markAsRead();

        return response()->json(['success' => true]);
    }

    /**
     * Mark all notifications as read.
     */
    public function markAllAsRead()
    {
        $user = Auth::user();
        DatabaseNotification::where('notifiable_id', $user->id)
                          ->where('notifiable_type', get_class($user))
                          ->whereNull('read_at')
                          ->update(['read_at' => now()]);

        return response()->json(['success' => true]);
    }

    /**
     * Delete a notification.
     */
    public function destroy($id)
    {
        $user = Auth::user();
        $notification = DatabaseNotification::where('id', $id)
                                          ->where('notifiable_id', $user->id)
                                          ->where('notifiable_type', get_class($user))
                                          ->firstOrFail();
        $notification->delete();

        return response()->json(['success' => true]);
    }

    /**
     * Delete all notifications.
     */
    public function destroyAll()
    {
        $user = Auth::user();
        DatabaseNotification::where('notifiable_id', $user->id)
                          ->where('notifiable_type', get_class($user))
                          ->delete();

        return response()->json(['success' => true]);
    }

    /**
     * Diagnostic endpoint to debug notification issues.
     */
    public function debug()
    {
        $user = Auth::user();

        // Get all notifications for the user without any filtering
        $allNotifications = DatabaseNotification::where('notifiable_id', $user->id)
                                              ->where('notifiable_type', get_class($user))
                                              ->orderBy('created_at', 'desc')
                                              ->get();

        // Get notifications with role filtering
        $role = $user->role;
        $filteredQuery = DatabaseNotification::where('notifiable_id', $user->id)
                                           ->where('notifiable_type', get_class($user))
                                           ->where(function($q) use ($role) {
                                               $q->whereJsonContains('data->for_roles', $role)
                                                 ->orWhereRaw("JSON_EXTRACT(data, '$.for_roles') IS NULL")
                                                 ->orWhereRaw("JSON_TYPE(JSON_EXTRACT(data, '$.for_roles')) = 'NULL'")
                                                 ->orWhereRaw("JSON_LENGTH(JSON_EXTRACT(data, '$.for_roles')) = 0")
                                                 ->orWhereRaw("JSON_EXTRACT(data, '$.for_roles') = '[]'")
                                                 ->orWhereRaw("NOT JSON_CONTAINS(data, JSON_ARRAY(?), '$.for_roles')", [$role]);
                                           })
                                           ->orderBy('created_at', 'desc');

        $filteredNotifications = $filteredQuery->get();

        // Log detailed information about each notification
        foreach ($allNotifications as $notification) {
            Log::info('Notification details:', [
                'id' => $notification->id,
                'type' => $notification->type,
                'data' => $notification->data,
                'created_at' => $notification->created_at,
                'read_at' => $notification->read_at,
                'for_roles' => $notification->data['for_roles'] ?? null,
                'would_be_filtered' => $filteredNotifications->contains('id', $notification->id) ? 'No' : 'Yes'
            ]);
        }

        return Inertia::render('Notifications/Debug', [
            'allNotifications' => $allNotifications,
            'filteredNotifications' => $filteredNotifications,
            'userRole' => $role,
            'sqlQuery' => $filteredQuery->toSql(),
            'sqlBindings' => $filteredQuery->getBindings(),
        ]);
    }

    /**
     * Create a test notification for the current user.
     */
    public function createTestNotification()
    {
        $user = Auth::user();

        try {
            // Get a game for testing
            $game = \App\Models\Jeu::first();
            if (!$game) {
                return redirect()->route('notifications.debug')->with('error', 'No games found in the database for testing.');
            }

            // Create a test notification based on user role
            if ($user->role === 'admin') {
                // Create a test game submission notification
                $user->notify(new \App\Notifications\NewGameSubmission($game));
                Log::info('Test game submission notification created for admin: ' . $user->id);
            } elseif ($user->role === 'developer' || $user->is_developer) {
                // Create a test game approval notification
                $user->notify(new \App\Notifications\GameApproved($game));
                Log::info('Test game approval notification created for developer: ' . $user->id);
            } else {
                // Try to get an existing comment
                $comment = \App\Models\Comment::first();

                // If no comment exists, create a dummy one
                if (!$comment) {
                    $comment = new \App\Models\Comment([
                        'id' => 1,
                        'user_id' => $user->id,
                        'jeu_id' => $game->id,
                        'content' => 'Test comment',
                        'is_approved' => true,
                        'is_flagged' => false,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }

                // Create a test comment approval notification
                $user->notify(new \App\Notifications\CommentApproved($comment));
                Log::info('Test comment approval notification created for user: ' . $user->id);
            }

            return redirect()->route('notifications.debug')->with('success', 'Test notification created successfully!');
        } catch (\Exception $e) {
            Log::error('Error creating test notification: ' . $e->getMessage());
            return redirect()->route('notifications.debug')->with('error', 'Error creating test notification: ' . $e->getMessage());
        }
    }
}
