<?php
/**
 * Simple image proxy script to handle external images
 * This helps avoid CORS issues and provides a fallback for external images
 */

// Set appropriate headers for an image
header('Content-Type: image/jpeg');
header('Cache-Control: max-age=86400, public'); // Cache for 1 day

// Get the URL from the query string
$url = isset($_GET['url']) ? $_GET['url'] : null;

// Validate the URL
if (!$url || !filter_var($url, FILTER_VALIDATE_URL)) {
    // If URL is invalid, return a placeholder image
    $placeholderPath = __DIR__ . '/images/placeholder-game.png';
    if (file_exists($placeholderPath)) {
        readfile($placeholderPath);
    } else {
        // If placeholder doesn't exist, return a 1x1 transparent pixel
        echo base64_decode('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7');
    }
    exit;
}

// Create cache directory if it doesn't exist
$cacheDir = __DIR__ . '/storage/proxy_images';
if (!is_dir($cacheDir)) {
    mkdir($cacheDir, 0755, true);
}

// Generate a cache filename based on the URL
$cacheFile = $cacheDir . '/' . md5($url) . '.jpg';

// Check if the image is already cached
if (file_exists($cacheFile) && (time() - filemtime($cacheFile) < 86400)) {
    // Use cached version if it's less than a day old
    readfile($cacheFile);
    exit;
}

// Try to fetch the image
$image = @file_get_contents($url);

if ($image === false) {
    // If fetching fails, return the placeholder
    $placeholderPath = __DIR__ . '/images/placeholder-game.png';
    if (file_exists($placeholderPath)) {
        readfile($placeholderPath);
    } else {
        // If placeholder doesn't exist, return a 1x1 transparent pixel
        echo base64_decode('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7');
    }
    exit;
}

// Save the image to cache
file_put_contents($cacheFile, $image);

// Output the image
echo $image;
