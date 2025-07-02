<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Statut;

class StatutSeeder extends Seeder
{
    public function run()
    {
        $statuses = [
            ['code' => 'ACTIVE', 'description' => 'Active Status'],
            ['code' => 'INACTIVE', 'description' => 'Inactive Status'],
            ['code' => 'brouillon', 'description' => 'Draft Game'],
            ['code' => 'en_attente', 'description' => 'Game Pending Approval'],
            ['code' => 'publie', 'description' => 'Published Game'],
            ['code' => 'rejete', 'description' => 'Rejected Game'],
        ];

        foreach ($statuses as $status) {
            Statut::firstOrCreate($status);
        }
    }
}