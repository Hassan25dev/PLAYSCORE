<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;

class RestoreSoftDeletedUsers extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'users:restore {--all : Restore all soft-deleted users} 
                                         {--email= : Restore a specific user by email}
                                         {--role= : Restore users with a specific role (admin, developer, user)}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Restore soft-deleted users';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $query = User::onlyTrashed();

        // Filter by email if provided
        if ($email = $this->option('email')) {
            $query->where('email', $email);
        }

        // Filter by role if provided
        if ($role = $this->option('role')) {
            $query->where('role', $role);
        }

        // Get the users to restore
        $users = $query->get();

        if ($users->isEmpty()) {
            $this->info('No soft-deleted users found matching the criteria.');
            return;
        }

        $this->info('Found ' . $users->count() . ' soft-deleted users:');
        
        // Display the users to restore
        $headers = ['ID', 'Name', 'Email', 'Role', 'Deleted At'];
        $rows = [];
        
        foreach ($users as $user) {
            $rows[] = [
                $user->id,
                $user->name,
                $user->email,
                $user->role,
                $user->deleted_at->format('Y-m-d H:i:s')
            ];
        }
        
        $this->table($headers, $rows);
        
        // Confirm restoration
        if (!$this->option('all') && !$this->confirm('Do you want to restore these users?')) {
            $this->info('Operation cancelled.');
            return;
        }
        
        // Restore the users
        foreach ($users as $user) {
            $user->restore();
            $this->info("Restored user: {$user->email}");
        }
        
        $this->info('User restoration completed successfully.');
    }
}
