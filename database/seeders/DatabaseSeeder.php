<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Run the status seeder first
        $this->call(StatutSeeder::class);

        // Run the role and permission seeders
        $this->call(RoleSeeder::class);
        $this->call(PermissionSeeder::class);

        // Run the user seeder
        $this->call(UserSeeder::class);

        // You can uncomment these lines to create test data
        // \App\Models\User::factory(10)->create();
    }
}
