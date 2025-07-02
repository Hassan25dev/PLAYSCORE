<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{ $game->title }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
        }
        .game-info {
            margin-bottom: 20px;
        }
        .rating {
            font-size: 18px;
            font-weight: bold;
        }
        .section {
            margin-bottom: 15px;
        }
        .section-title {
            font-weight: bold;
            margin-bottom: 5px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        table, th, td {
            border: 1px solid #ddd;
        }
        th, td {
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>{{ $game->title }}</h1>
        <p>{{ __('Fiche détaillée du jeu') }}</p>
    </div>
    
    <div class="game-info">
        <div class="section">
            <div class="section-title">{{ __('Description') }}:</div>
            <p>{{ $game->description }}</p>
        </div>
        
        <div class="section">
            <div class="section-title">{{ __('Date de sortie') }}:</div>
            <p>{{ $game->release_date->format('d/m/Y') }}</p>
        </div>
        
        <div class="section">
            <div class="section-title">{{ __('Genres') }}:</div>
            <p>{{ $game->genres->pluck('name')->implode(', ') }}</p>
        </div>
        
        <div class="section">
            <div class="section-title">{{ __('Plateformes') }}:</div>
            <p>{{ $game->platforms->pluck('name')->implode(', ') }}</p>
        </div>
        
        <div class="section">
            <div class="section-title">{{ __('Évaluation moyenne') }}:</div>