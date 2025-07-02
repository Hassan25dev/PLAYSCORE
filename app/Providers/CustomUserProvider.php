<?php

namespace App\Providers;

use Illuminate\Auth\EloquentUserProvider;
use Illuminate\Contracts\Auth\Authenticatable as UserContract;

class CustomUserProvider extends EloquentUserProvider
{
    /**
     * Retrieve a user by the given credentials.
     * This overrides the parent method to include soft-deleted users in the query.
     *
     * @param  array  $credentials
     * @return \Illuminate\Contracts\Auth\Authenticatable|null
     */
    public function retrieveByCredentials(array $credentials)
    {
        if (empty($credentials) ||
           (count($credentials) === 1 &&
            array_key_exists('password', $credentials))) {
            return null;
        }

        // First try to find the user without considering soft-deleted records
        $user = parent::retrieveByCredentials($credentials);

        // If no user is found, try to find them including soft-deleted records
        if (!$user) {
            // Create a query based on the model
            $query = $this->createModel()->withTrashed();

            foreach ($credentials as $key => $value) {
                if (! str_contains($key, 'password')) {
                    $query->where($key, $value);
                }
            }

            $user = $query->first();

            // If we found a soft-deleted user, restore them
            if ($user && $user->trashed()) {
                $user->restore();

                // Log this restoration for audit purposes
                \Illuminate\Support\Facades\Log::info("Restored soft-deleted user during authentication: {$user->email} (Role: {$user->role})");

                // If this is an admin or developer account, add additional logging
                if ($user->role === 'admin' || $user->hasRole('admin')) {
                    \Illuminate\Support\Facades\Log::warning("Admin account was restored during login: {$user->email}");
                } else if ($user->role === 'developer' || $user->is_developer || $user->hasRole('developer')) {
                    \Illuminate\Support\Facades\Log::warning("Developer account was restored during login: {$user->email}");
                }
            }
        }

        return $user;
    }

    /**
     * Validate a user against the given credentials.
     * This overrides the parent method to include soft-deleted users in validation.
     *
     * @param  \Illuminate\Contracts\Auth\Authenticatable  $user
     * @param  array  $credentials
     * @return bool
     */
    public function validateCredentials(UserContract $user, array $credentials)
    {
        // Even if the user is soft-deleted, we'll validate their credentials
        $plain = $credentials['password'];

        return $this->hasher->check($plain, $user->getAuthPassword());
    }
}
