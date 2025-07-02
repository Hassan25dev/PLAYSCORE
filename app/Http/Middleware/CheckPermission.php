<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckPermission
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string|array  ...$permissions
     * @return mixed
     */
    public function handle(Request $request, Closure $next, ...$permissions): Response
    {
        if (!$request->user()) {
            return redirect()->route('login');
        }

        // Check if user has any of the specified permissions
        foreach ($permissions as $permission) {
            if ($request->user()->hasPermission($permission)) {
                return $next($request);
            }
        }

        // If using Inertia, return JSON response for API requests
        if ($request->expectsJson()) {
            return response()->json(['message' => 'Unauthorized. Insufficient permissions.'], 403);
        }

        // Redirect to dashboard with error message
        return redirect()->route('dashboard')->with('error', 'You do not have permission to perform this action.');
    }
}
