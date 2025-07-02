@extends('layouts.app')

@section('content')
<div class="container">
    <h1>User Profile</h1>
    <p><strong>Name:</strong> {{ auth()->user()->name }}</p>
    <p><strong>Email:</strong> {{ auth()->user()->email }}</p>
    
    <h3>Your Wishlist</h3>
    <div id="wishlist">
        <!-- Wishlist items will be displayed here -->
    </div>
    
    <h3>Submit Evaluation</h3>
    <form id="evaluation-form">
        <input type="hidden" id="game-id" value="">
        <label for="rating">Rating (1-5):</label>
        <input type="number" id="rating" min="1" max="5" required>
        <label for="comment">Comment:</label>
        <textarea id="comment"></textarea>
        <button type="submit">Submit Evaluation</button>
    </form>
</div>

<script>
    document.getElementById('evaluation-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const gameId = document.getElementById('game-id').value;
        const rating = document.getElementById('rating').value;
        const comment = document.getElementById('comment').value;

        await submitEvaluation({ game_id: gameId, rating, comment });
        alert('Evaluation submitted successfully!');
    });
</script>
@endsection
