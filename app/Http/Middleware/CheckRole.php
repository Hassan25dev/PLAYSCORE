<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string|array  ...$roles
     * @return mixed
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        if (!$request->user()) {
            return redirect()->route('login');
        }

        // Check if user has any of the specified roles
        foreach ($roles as $role) {
            // Support for legacy role field
            if ($request->user()->role === $role) {
                return $next($request);
            }

            // Support for new role-permission system
            if ($request->user()->hasRole($role)) {
                return $next($request);
            }
        }

        // If using Inertia, redirect to a 403 page
        if ($request->expectsJson()) {
            return response()->json(['message' => 'Unauthorized. Insufficient role permissions.'], 403);
        }

        // Redirect to dashboard with error message
        return redirect()->route('dashboard')->with('error', 'You do not have permission to access this page.');
    }
}
