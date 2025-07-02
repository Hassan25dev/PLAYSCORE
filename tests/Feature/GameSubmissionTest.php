<?php

namespace Tests\Feature;

use App\Models\Jeu;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class GameSubmissionTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Create necessary database records
        $this->seed(\Database\Seeders\StatutSeeder::class);
        $this->seed(\Database\Seeders\RoleSeeder::class);
        $this->seed(\Database\Seeders\PermissionSeeder::class);
        
        // Create storage disk for testing
        Storage::fake('public');
    }

    /** @test */
    public function a_developer_can_submit_a_game()
    {
        // Create a developer user
        $developer = User::factory()->create([
            'role' => 'developer',
            'is_developer' => true,
        ]);

        // Create a fake image
        $image = UploadedFile::fake()->image('game.jpg');

        // Submit a game
        $response = $this->actingAs($developer)
            ->post(route('developer.game-submissions.store'), [
                'titre' => 'Test Game',
                'description' => 'This is a test game',
                'date_sortie' => '2023-01-01',
                'image_arriere_plan' => $image,
                'submit' => true,
            ]);

        // Assert the game was created
        $this->assertDatabaseHas('jeux', [
            'titre' => 'Test Game',
            'description' => 'This is a test game',
            'statut' => 'en_attente',
            'developpeur_id' => $developer->id,
        ]);

        // Assert the image was stored
        $game = Jeu::where('titre', 'Test Game')->first();
        Storage::disk('public')->assertExists(str_replace('storage/', '', $game->image_arriere_plan));
    }

    /** @test */
    public function a_developer_can_save_a_game_as_draft()
    {
        // Create a developer user
        $developer = User::factory()->create([
            'role' => 'developer',
            'is_developer' => true,
        ]);

        // Create a fake image
        $image = UploadedFile::fake()->image('game.jpg');

        // Submit a game as draft
        $response = $this->actingAs($developer)
            ->post(route('developer.game-submissions.store'), [
                'titre' => 'Draft Game',
                'description' => 'This is a draft game',
                'date_sortie' => '2023-01-01',
                'image_arriere_plan' => $image,
                'submit' => false,
            ]);

        // Assert the game was created as draft
        $this->assertDatabaseHas('jeux', [
            'titre' => 'Draft Game',
            'description' => 'This is a draft game',
            'statut' => 'brouillon',
            'developpeur_id' => $developer->id,
        ]);
    }

    /** @test */
    public function an_admin_can_see_submitted_games()
    {
        // Create an admin user
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);

        // Create a developer user
        $developer = User::factory()->create([
            'role' => 'developer',
            'is_developer' => true,
        ]);

        // Create a game
        $game = Jeu::factory()->create([
            'titre' => 'Submitted Game',
            'description' => 'This is a submitted game',
            'statut' => 'en_attente',
            'developpeur_id' => $developer->id,
            'submitted_at' => now(),
        ]);

        // Visit the admin game approvals page
        $response = $this->actingAs($admin)
            ->get(route('admin.game-approvals.index'));

        // Assert the game is visible
        $response->assertSee('Submitted Game');
    }
}
