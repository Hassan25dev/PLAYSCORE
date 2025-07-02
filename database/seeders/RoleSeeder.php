<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create default roles
        $roles = [
            [
                'name' => 'Administrator',
                'slug' => 'admin',
                'description' => 'Administrator with full access to all features'
            ],
            [
                'name' => 'Developer',
                'slug' => 'developer',
                'description' => 'Game developer who can submit games for approval'
            ],
            [
                'name' => 'User',
                'slug' => 'user',
                'description' => 'Regular user who can rate games and add them to wishlist'
            ],
            [
                'name' => 'Moderator',
                'slug' => 'moderator',
                'description' => 'Moderator who can approve/reject comments and reviews'
            ]
        ];

        foreach ($roles as $role) {
            Role::firstOrCreate(['slug' => $role['slug']], $role);
        }
    }
}
