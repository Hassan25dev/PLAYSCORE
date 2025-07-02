<?php

namespace App\Models;

use App\Notifications\CustomVerifyEmail;
use Illuminate\Contracts\Auth\MustVerifyEmail as MustVerifyEmailContract;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes; // Ajout
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements MustVerifyEmailContract
{
    use HasApiTokens,
        HasFactory,
        Notifiable,
        SoftDeletes; // Ajout de SoftDeletes

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        // Add protection for all user accounts against unexpected deletion
        static::deleting(function ($user) {
            // Get the current authenticated user (if any)
            $currentUser = \Illuminate\Support\Facades\Auth::user();

            // If this is a force delete from the ProfileController (intentional account deletion)
            // we'll allow it to proceed - this is identified by checking the backtrace
            $backtrace = debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 10);
            $isProfileDeletion = false;

            foreach ($backtrace as $trace) {
                if (isset($trace['class']) && $trace['class'] === 'App\\Http\\Controllers\\ProfileController' &&
                    isset($trace['function']) && $trace['function'] === 'destroy') {
                    $isProfileDeletion = true;
                    break;
                }
            }

            // If this is a force delete, we'll allow it to proceed
            if ($user->isForceDeleting()) {
                \Illuminate\Support\Facades\Log::info("User account force deleted: {$user->email}");
                return true;
            }

            // If this is an intentional profile deletion, allow it
            if ($isProfileDeletion) {
                \Illuminate\Support\Facades\Log::info("User account intentionally deleted by owner: {$user->email}");
                return true;
            }

            // If this is an admin deleting a user through the admin panel, allow it
            if ($currentUser && $currentUser->isAdmin() && $currentUser->id !== $user->id) {
                \Illuminate\Support\Facades\Log::info("User account deleted by admin {$currentUser->email}: {$user->email}");
                return true;
            }

            // For all other cases, we'll prevent the deletion as it might be unexpected
            \Illuminate\Support\Facades\Log::warning("Prevented unexpected deletion of user account: {$user->email}");
            return false;
        });
    }

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'language',
        'is_developer',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'is_developer' => 'boolean',
    ];

    // Conservation des relations existantes
    public function evaluations()
    {
        return $this->hasMany(Evaluation::class, 'utilisateur_id');
    }

    public function jeux()
    {
        return $this->hasMany(Jeu::class, 'developpeur_id');
    }

    /**
     * The wishlist games for the user.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function wishlist()
    {
        return $this->belongsToMany(Jeu::class, 'wishlists', 'user_id', 'jeu_id')->withTimestamps();
    }


    public function parametres()
    {
        return $this->hasMany(Parametre::class);
    }

    public function historique()
    {
        return $this->hasMany(Historique::class);
    }

    /**
     * The roles that belong to the user.
     */
    public function roles()
    {
        return $this->belongsToMany(Role::class);
    }

    /**
     * Get all permissions for the user through their roles.
     * This is a dynamic accessor, not a relationship.
     *
     * @return \Illuminate\Support\Collection
     */
    public function getPermissionsAttribute()
    {
        if ($this->relationLoaded('roles') && $this->roles->isNotEmpty()) {
            return $this->roles->flatMap(function ($role) {
                return $role->permissions;
            })->unique('id')->values();
        }

        return collect();
    }

    /**
     * Get the comments for the user.
     */
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    /**
     * Get all of the user's notifications.
     */
    public function notifications()
    {
        return $this->morphMany('Illuminate\Notifications\DatabaseNotification', 'notifiable')
                    ->orderBy('created_at', 'desc');
    }



    /**
     * Check if the user has a specific role
     */
    public function hasRole($role)
    {
        if (is_string($role)) {
            return $this->roles->contains('slug', $role);
        }

        return !!$role->intersect($this->roles)->count();
    }

    /**
     * Check if the user has any of the given roles
     */
    public function hasAnyRole($roles)
    {
        if (is_string($roles)) {
            return $this->hasRole($roles);
        }

        foreach ($roles as $role) {
            if ($this->hasRole($role)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Check if the user has all of the given roles
     */
    public function hasAllRoles($roles)
    {
        if (is_string($roles)) {
            return $this->hasRole($roles);
        }

        foreach ($roles as $role) {
            if (!$this->hasRole($role)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Check if the user has a specific permission through any of their roles
     */
    public function hasPermission($permission)
    {
        foreach ($this->roles as $role) {
            if ($role->hasPermission($permission)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Check if the user is an admin.
     */
    public function isAdmin()
    {
        return $this->role === 'admin' || $this->hasRole('admin');
    }

    /**
     * Check if the user is a developer.
     */
    public function isDeveloper()
    {
        return $this->role === 'developer' || $this->is_developer || $this->hasRole('developer');
    }

    /**
     * Check if the user is a regular user.
     */
    public function isUser()
    {
        return $this->role === 'user' || $this->hasRole('user');
    }

    /**
     * Check if the user is soft-deleted.
     */
    public function isSoftDeleted()
    {
        return $this->trashed();
    }

    /**
     * Restore a soft-deleted user.
     */
    public function restoreAccount()
    {
        if ($this->trashed()) {
            $this->restore();
            \Illuminate\Support\Facades\Log::info("User account restored: {$this->email}");
            return true;
        }

        return false;
    }

    /**
     * Send the email verification notification.
     *
     * @return void
     */
    public function sendEmailVerificationNotification()
    {
        $this->notify(new CustomVerifyEmail);
        \Illuminate\Support\Facades\Log::info("Email verification notification sent to: {$this->email}");
    }
}
