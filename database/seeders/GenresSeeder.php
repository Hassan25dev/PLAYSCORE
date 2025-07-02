<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Genre;
use Illuminate\Support\Facades\DB;

class GenresSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Disable foreign key checks to allow truncation
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        // Clear existing genres to avoid duplicates
        DB::table('genres')->truncate();
        // Re-enable foreign key checks
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // Create genres
        $genres = [
            ['nom' => 'Action', 'slug' => 'action'],
            ['nom' => 'Adventure', 'slug' => 'adventure'],
            ['nom' => 'RPG', 'slug' => 'rpg'],
            ['nom' => 'Strategy', 'slug' => 'strategy'],
            ['nom' => 'Shooter', 'slug' => 'shooter'],
            ['nom' => 'Simulation', 'slug' => 'simulation'],
            ['nom' => 'Sports', 'slug' => 'sports'],
            ['nom' => 'Racing', 'slug' => 'racing'],
            ['nom' => 'Puzzle', 'slug' => 'puzzle'],
            ['nom' => 'Fighting', 'slug' => 'fighting'],
            ['nom' => 'Platformer', 'slug' => 'platformer'],
            ['nom' => 'MMORPG', 'slug' => 'mmorpg'],
            ['nom' => 'Casual', 'slug' => 'casual'],
            ['nom' => 'Indie', 'slug' => 'indie'],
            ['nom' => 'Horror', 'slug' => 'horror'],
            ['nom' => 'Stealth', 'slug' => 'stealth'],
            ['nom' => 'Educational', 'slug' => 'educational'],
            ['nom' => 'Music', 'slug' => 'music'],
            ['nom' => 'Visual Novel', 'slug' => 'visual-novel'],
            ['nom' => 'Card Game', 'slug' => 'card-game'],
        ];

        // Insert genres directly using DB facade for better performance
        foreach ($genres as $genre) {
            Genre::create($genre);
        }

        $this->command->info('Genres created successfully!');
    }
}
