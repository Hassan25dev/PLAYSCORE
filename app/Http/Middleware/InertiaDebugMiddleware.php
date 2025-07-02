<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class InertiaDebugMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        Log::info('Inertia Request', [
            'url' => $request->url(),
            'method' => $request->method(),
            'headers' => $request->headers->all(),
            'is_inertia' => $request->header('X-Inertia') ? 'Yes' : 'No',
        ]);

        $response = $next($request);

        if ($response->headers->has('X-Inertia')) {
            Log::info('Inertia Response', [
                'status' => $response->getStatusCode(),
                'headers' => $response->headers->all(),
                'content' => json_decode($response->getContent(), true),
            ]);
        }

        return $response;
    }
}