<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class VerifyAdminEmail extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'admin:verify-email {email? : The email of the admin account to verify}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Mark the admin account as email verified';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->argument('email') ?? 'admin@playscore.com';

        $user = User::where('email', $email)->first();

        if (!$user) {
            $this->error("User with email {$email} not found.");
            return 1;
        }

        if ($user->role !== 'admin') {
            $this->warn("User with email {$email} is not an admin. Current role: {$user->role}");
            
            if ($this->confirm('Do you want to verify this user anyway?')) {
                // Continue with verification
            } else {
                return 1;
            }
        }

        if ($user->email_verified_at) {
            $this->info("User {$email} is already verified.");
            return 0;
        }

        // Mark the user as verified
        $user->email_verified_at = now();
        $user->save();

        $this->info("User {$email} has been marked as verified successfully!");
        return 0;
    }
}
