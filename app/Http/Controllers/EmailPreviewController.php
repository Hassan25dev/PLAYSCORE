<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Notifications\CustomVerifyEmail;

class EmailPreviewController extends Controller
{
    public function previewVerificationEmail()
    {
        $user = Auth::user() ?? User::first();
        
        if (!$user) {
            return 'No user found to generate preview';
        }
        
        $notification = new CustomVerifyEmail;
        
        $mailMessage = $notification->toMail($user);
        
        return $mailMessage->render();
    }
}