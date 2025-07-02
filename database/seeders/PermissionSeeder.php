<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Permission;
use App\Models\Role;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create permissions
        $permissions = [
            // Game management permissions
            [
                'name' => 'View Games',
                'slug' => 'view-games',
                'description' => 'Can view all games'
            ],
            [
                'name' => 'Create Games',
                'slug' => 'create-games',
                'description' => 'Can create new games'
            ],
            [
                'name' => 'Edit Games',
                'slug' => 'edit-games',
                'description' => 'Can edit existing games'
            ],
            [
                'name' => 'Delete Games',
                'slug' => 'delete-games',
                'description' => 'Can delete games'
            ],
            [
                'name' => 'Approve Games',
                'slug' => 'approve-games',
                'description' => 'Can approve game submissions'
            ],
            [
                'name' => 'Reject Games',
                'slug' => 'reject-games',
                'description' => 'Can reject game submissions'
            ],
            [
                'name' => 'Feature Games',
                'slug' => 'feature-games',
                'description' => 'Can mark games as featured'
            ],

            // User management permissions
            [
                'name' => 'View Users',
                'slug' => 'view-users',
                'description' => 'Can view all users'
            ],
            [
                'name' => 'Create Users',
                'slug' => 'create-users',
                'description' => 'Can create new users'
            ],
            [
                'name' => 'Edit Users',
                'slug' => 'edit-users',
                'description' => 'Can edit existing users'
            ],
            [
                'name' => 'Delete Users',
                'slug' => 'delete-users',
                'description' => 'Can delete users'
            ],

            // Comment management permissions
            [
                'name' => 'View Comments',
                'slug' => 'view-comments',
                'description' => 'Can view all comments'
            ],
            [
                'name' => 'Create Comments',
                'slug' => 'create-comments',
                'description' => 'Can create new comments'
            ],
            [
                'name' => 'Edit Comments',
                'slug' => 'edit-comments',
                'description' => 'Can edit existing comments'
            ],
            [
                'name' => 'Delete Comments',
                'slug' => 'delete-comments',
                'description' => 'Can delete comments'
            ],
            [
                'name' => 'Approve Comments',
                'slug' => 'approve-comments',
                'description' => 'Can approve comments'
            ],
            [
                'name' => 'Flag Comments',
                'slug' => 'flag-comments',
                'description' => 'Can flag comments as inappropriate'
            ],

            // Rating permissions
            [
                'name' => 'Rate Games',
                'slug' => 'rate-games',
                'description' => 'Can rate games'
            ],

            // Wishlist permissions
            [
                'name' => 'Manage Wishlist',
                'slug' => 'manage-wishlist',
                'description' => 'Can add/remove games from wishlist'
            ],

            // Report generation permissions
            [
                'name' => 'Generate Reports',
                'slug' => 'generate-reports',
                'description' => 'Can generate system reports'
            ],
        ];

        // Create all permissions
        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['slug' => $permission['slug']], $permission);
        }

        // Assign permissions to roles
        $this->assignPermissionsToRoles();
    }

    /**
     * Assign permissions to roles
     */
    private function assignPermissionsToRoles(): void
    {
        // Get roles
        $adminRole = Role::where('slug', 'admin')->first();
        $developerRole = Role::where('slug', 'developer')->first();
        $userRole = Role::where('slug', 'user')->first();
        $moderatorRole = Role::where('slug', 'moderator')->first();

        if (!$adminRole || !$developerRole || !$userRole || !$moderatorRole) {
            // Roles not found, run RoleSeeder first
            return;
        }

        // Admin gets all permissions
        $adminRole->permissions()->sync(Permission::all());

        // Developer permissions
        $developerPermissions = Permission::whereIn('slug', [
            'view-games',
            'create-games',
            'edit-games',
            'view-comments',
            'create-comments',
            'edit-comments',
            'rate-games',
            'manage-wishlist',
        ])->get();
        $developerRole->permissions()->sync($developerPermissions);

        // User permissions
        $userPermissions = Permission::whereIn('slug', [
            'view-games',
            'view-comments',
            'create-comments',
            'rate-games',
            'manage-wishlist',
            'flag-comments',
        ])->get();
        $userRole->permissions()->sync($userPermissions);

        // Moderator permissions
        $moderatorPermissions = Permission::whereIn('slug', [
            'view-games',
            'view-comments',
            'edit-comments',
            'delete-comments',
            'approve-comments',
            'flag-comments',
            'view-users',
        ])->get();
        $moderatorRole->permissions()->sync($moderatorPermissions);
    }
}
