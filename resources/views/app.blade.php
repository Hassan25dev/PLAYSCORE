<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        <script>
            // Diagnostic script to help identify loading issues
            console.log('Initial page load started');
            
            // Check if Vite is loaded
            if (window.vite) {
                console.log('Vite is available on window object');
            } else {
                console.log('Vite is NOT available on window object');
            }
            
            // Log when DOM is ready
            document.addEventListener('DOMContentLoaded', function() {
                console.log('DOM content loaded');
            });
            
            // Log when window is fully loaded
            window.addEventListener('load', function() {
                console.log('Window fully loaded');
                
                // Check if React is loaded
                if (window.React) {
                    console.log('React is available on window object');
                } else {
                    console.log('React is NOT available on window object');
                }
                
                // Check if the app is still loading after 10 seconds
                setTimeout(function() {
                    console.log('10-second check running');
                    if (document.querySelector('body').innerHTML.includes('Loading PlayScore')) {
                        console.error('Application still showing loading screen after 10 seconds');
                        console.log('Current body content:', document.body.innerHTML);
                        console.error('Vite server connection timeout. Redirecting to fallback page...');
                        window.location.href = '/fallback.html';
                    } else {
                        console.log('Application loaded successfully within 10 seconds');
                    }
                }, 10000);
            });
        </script>
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
