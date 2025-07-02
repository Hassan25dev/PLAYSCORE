@extends('layouts.app')

@section('content')
<div class="container">
    <h1 id="game-title"></h1>
    <p id="game-description"></p>
    <p><strong>Release Date:</strong> <span id="game-release-date"></span></p>
    <p><strong>Genre:</strong> <span id="game-genre"></span></p>
    <p><strong>Platform:</strong> <span id="game-platform"></span></p>
    <h3>Ratings</h3>
    <div id="ratings">
        <!-- Ratings will be displayed here -->
    </div>
</div>

<script>
    const gameId = window.location.pathname.split('/').pop(); // Get the game ID from the URL
    fetchGameDetails(gameId);
    
    async function fetchGameDetails(id) {
        const response = await fetch(`/api/games/${id}`);
        const game = await response.json();
        
        document.getElementById('game-title').innerText = game.title;
        document.getElementById('game-description').innerText = game.description;
        document.getElementById('game-release-date').innerText = game.release_date;
        document.getElementById('game-genre').innerText = game.genre;
        document.getElementById('game-platform').innerText = game.platform;
    }
</script>
@endsection