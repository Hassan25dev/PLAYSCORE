<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class CheckUsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();
        
        $this->command->info('List of all users:');
        $this->command->info('------------------');
        
        foreach ($users as $user) {
            $this->command->info("ID: {$user->id}, Name: {$user->name}, Email: {$user->email}, Role: {$user->role}");
        }
    }
}
