<?php

namespace App\Http\Controllers;

use App\Mail\TestEmail;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class EmailTestController extends Controller
{
    /**
     * Show the email testing interface.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        // Get all users for admin to select from
        $users = [];
        
        if (Auth::user()->role === 'admin') {
            $users = User::select('id', 'name', 'email', 'role')->get();
        }
        
        return Inertia::render('Admin/EmailTest', [
            'users' => $users,
            'currentUser' => Auth::user(),
        ]);
    }
    
    /**
     * Send a test email to the specified user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function sendTestEmail(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);
        
        $user = Auth::user();
        
        // Only admins can send emails to other users
        if ($user->role !== 'admin' && $request->email !== $user->email) {
            return back()->with('error', 'You can only send test emails to yourself.');
        }
        
        try {
            Mail::to($request->email)->send(new TestEmail());
            return back()->with('success', 'Test email sent successfully!');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to send email: ' . $e->getMessage());
        }
    }
    
    /**
     * Send a test email to the current user.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function sendToSelf()
    {
        $user = Auth::user();
        
        if (!$user) {
            return response()->json(['message' => 'No authenticated user'], 401);
        }
        
        try {
            Mail::to($user->email)->send(new TestEmail());
            return response()->json(['message' => 'Test email sent to ' . $user->email]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to send email: ' . $e->getMessage()], 500);
        }
    }
}
