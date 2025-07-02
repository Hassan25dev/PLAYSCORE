<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Providers\RouteServiceProvider;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class EmailVerificationNotificationController extends Controller
{
    /**
     * Send a new email verification notification.
     */
    public function store(Request $request): RedirectResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            Log::info('User already verified: ' . $request->user()->email);
            return redirect()->intended(RouteServiceProvider::HOME);
        }

        Log::info('Sending verification email to: ' . $request->user()->email);
        try {
            $request->user()->sendEmailVerificationNotification();
            Log::info('Verification email sent successfully');
        } catch (\Exception $e) {
            Log::error('Failed to send verification email: ' . $e->getMessage());
            return back()->with('error', 'Failed to send verification email. Please try again later.');
        }

        return back()->with('status', 'verification-link-sent');
    }
}
