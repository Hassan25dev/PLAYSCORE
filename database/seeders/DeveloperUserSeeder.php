<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;

class DeveloperUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create a developer user
        $user = User::firstOrCreate(
            ['email' => 'developer@playscore.com'],
            [
                'name' => 'Test Developer',
                'password' => Hash::make('password'),
                'role' => 'developer',
                'language' => 'fr',
                'is_developer' => true,
                'email_verified_at' => now()
            ]
        );

        // Get the developer role and attach it to the user
        $developerRole = Role::where('slug', 'developer')->first();
        if ($developerRole) {
            $user->roles()->sync([$developerRole->id]);
        }

        $this->command->info('Developer user created successfully!');
    }
}
