<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Plateforme;
use App\Models\Genre;
use App\Models\Tag;

class PlatformsGenresSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create platforms
        $platforms = [
            ['nom' => 'PC', 'slug' => 'pc'],
            ['nom' => 'PlayStation 5', 'slug' => 'ps5'],
            ['nom' => 'PlayStation 4', 'slug' => 'ps4'],
            ['nom' => 'Xbox Series X/S', 'slug' => 'xbox-series-x'],
            ['nom' => 'Xbox One', 'slug' => 'xbox-one'],
            ['nom' => 'Nintendo Switch', 'slug' => 'nintendo-switch'],
            ['nom' => 'iOS', 'slug' => 'ios'],
            ['nom' => 'Android', 'slug' => 'android'],
            ['nom' => 'Web', 'slug' => 'web'],
        ];

        foreach ($platforms as $platform) {
            Plateforme::firstOrCreate(['slug' => $platform['slug']], $platform);
        }

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
        ];

        foreach ($genres as $genre) {
            Genre::firstOrCreate(['slug' => $genre['slug']], $genre);
        }

        // Create tags
        $tags = [
            ['nom' => 'Multiplayer', 'slug' => 'multiplayer'],
            ['nom' => 'Single-player', 'slug' => 'single-player'],
            ['nom' => 'Co-op', 'slug' => 'co-op'],
            ['nom' => 'VR Support', 'slug' => 'vr-support'],
            ['nom' => 'Open World', 'slug' => 'open-world'],
            ['nom' => 'Indie', 'slug' => 'indie'],
            ['nom' => 'Early Access', 'slug' => 'early-access'],
            ['nom' => 'Free to Play', 'slug' => 'free-to-play'],
            ['nom' => 'Casual', 'slug' => 'casual'],
            ['nom' => 'Competitive', 'slug' => 'competitive'],
        ];

        foreach ($tags as $tag) {
            Tag::firstOrCreate(['slug' => $tag['slug']], $tag);
        }

        $this->command->info('Platforms, genres, and tags created successfully!');
    }
}
