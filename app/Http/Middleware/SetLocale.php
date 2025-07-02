<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if user is logged in and has a language preference
        if ($request->user() && $request->user()->language) {
            app()->setLocale($request->user()->language);
        }
        // Check if language is set in session
        else if (session()->has('locale')) {
            app()->setLocale(session('locale'));
        }
        // Default to application default language
        else {
            app()->setLocale(config('app.locale'));
        }

        return $next($request);
    }
}
