<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\DB;

class CheckUserAccounts extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'users:check {--fix : Automatically fix issues}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check for issues with user accounts and optionally fix them';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Checking user accounts...');

        // Check for soft-deleted admin and developer accounts
        $this->checkSoftDeletedAccounts();

        // Check for role-user relationship issues
        $this->checkRoleRelationships();

        // Check for missing admin account
        $this->checkAdminAccount();

        // Check for missing developer account
        $this->checkDeveloperAccount();

        $this->info('User account check completed.');
    }

    /**
     * Check for all soft-deleted user accounts
     */
    private function checkSoftDeletedAccounts()
    {
        // Check for all soft-deleted users
        $softDeletedUsers = User::onlyTrashed()->get();

        // Group users by role for better reporting
        $softDeletedAdmins = $softDeletedUsers->filter(function($user) {
            return $user->role === 'admin';
        });

        $softDeletedDevelopers = $softDeletedUsers->filter(function($user) {
            return $user->role === 'developer' || $user->is_developer;
        });

        $softDeletedRegularUsers = $softDeletedUsers->filter(function($user) {
            return $user->role === 'user' && !$user->is_developer;
        });

        if ($softDeletedAdmins->count() > 0) {
            $this->warn('Found ' . $softDeletedAdmins->count() . ' soft-deleted admin accounts:');
            foreach ($softDeletedAdmins as $admin) {
                $this->line(" - {$admin->email} (deleted at: {$admin->deleted_at})");

                if ($this->option('fix')) {
                    $admin->restore();
                    $this->info(" ✓ Restored admin account: {$admin->email}");
                }
            }
        } else {
            $this->info('No soft-deleted admin accounts found.');
        }

        if ($softDeletedDevelopers->count() > 0) {
            $this->warn('Found ' . $softDeletedDevelopers->count() . ' soft-deleted developer accounts:');
            foreach ($softDeletedDevelopers as $developer) {
                $this->line(" - {$developer->email} (deleted at: {$developer->deleted_at})");

                if ($this->option('fix')) {
                    $developer->restore();
                    $this->info(" ✓ Restored developer account: {$developer->email}");
                }
            }
        } else {
            $this->info('No soft-deleted developer accounts found.');
        }

        if ($softDeletedRegularUsers->count() > 0) {
            $this->warn('Found ' . $softDeletedRegularUsers->count() . ' soft-deleted regular user accounts:');
            foreach ($softDeletedRegularUsers as $user) {
                $this->line(" - {$user->email} (deleted at: {$user->deleted_at})");

                if ($this->option('fix')) {
                    $user->restore();
                    $this->info(" ✓ Restored user account: {$user->email}");
                }
            }
        } else {
            $this->info('No soft-deleted regular user accounts found.');
        }
    }

    /**
     * Check for role-user relationship issues
     */
    private function checkRoleRelationships()
    {
        // Check for admin users without admin role
        $adminUsers = User::where('role', 'admin')->get();
        $adminRole = Role::where('slug', 'admin')->first();

        if ($adminRole) {
            foreach ($adminUsers as $admin) {
                if (!$admin->roles->contains('id', $adminRole->id)) {
                    $this->warn("Admin user {$admin->email} does not have the admin role in the role_user table.");

                    if ($this->option('fix')) {
                        $admin->roles()->syncWithoutDetaching([$adminRole->id]);
                        $this->info(" ✓ Added admin role to user: {$admin->email}");
                    }
                }
            }
        }

        // Check for developer users without developer role
        $developerUsers = User::where('role', 'developer')
            ->orWhere('is_developer', true)
            ->get();
        $developerRole = Role::where('slug', 'developer')->first();

        if ($developerRole) {
            foreach ($developerUsers as $developer) {
                if (!$developer->roles->contains('id', $developerRole->id)) {
                    $this->warn("Developer user {$developer->email} does not have the developer role in the role_user table.");

                    if ($this->option('fix')) {
                        $developer->roles()->syncWithoutDetaching([$developerRole->id]);
                        $this->info(" ✓ Added developer role to user: {$developer->email}");
                    }
                }
            }
        }
    }

    /**
     * Check for missing admin account
     */
    private function checkAdminAccount()
    {
        $adminExists = User::where('role', 'admin')->exists();

        if (!$adminExists) {
            $this->warn('No admin account found in the system.');

            if ($this->option('fix')) {
                $this->call('db:seed', ['--class' => 'UserSeeder']);
                $this->info(" ✓ Created default admin account (admin@playscore.com)");
            }
        }
    }

    /**
     * Check for missing developer account
     */
    private function checkDeveloperAccount()
    {
        $developerExists = User::where('role', 'developer')
            ->orWhere('is_developer', true)
            ->exists();

        if (!$developerExists) {
            $this->warn('No developer account found in the system.');

            if ($this->option('fix')) {
                $this->call('db:seed', ['--class' => 'DeveloperUserSeeder']);
                $this->info(" ✓ Created default developer account (developer@playscore.com)");
            }
        }
    }
}
