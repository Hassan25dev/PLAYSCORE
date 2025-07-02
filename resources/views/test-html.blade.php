<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HTML Test - No Inertia</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 20px;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container {
            background: white;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            text-align: center;
            max-width: 600px;
        }
        h1 {
            color: #333;
            margin-bottom: 20px;
        }
        .status {
            background: #d4edda;
            color: #155724;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
            border: 1px solid #c3e6cb;
        }
        .info {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
            text-align: left;
        }
        .success {
            color: #28a745;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎯 HTML Test Page</h1>
        
        <div class="status">
            <h2 class="success">✅ Laravel Blade Template Working!</h2>
            <p>This page is rendered using Laravel's Blade templating engine without Inertia.js</p>
        </div>

        <div class="info">
            <h3>System Status:</h3>
            <ul>
                <li>✅ Laravel Framework: Working</li>
                <li>✅ PHP: {{ PHP_VERSION }}</li>
                <li>✅ Laravel Version: {{ app()->version() }}</li>
                <li>✅ Blade Templates: Working</li>
                <li>✅ Routing: Working</li>
                <li>⏳ Inertia.js: Testing...</li>
            </ul>
        </div>

        <div class="info">
            <h3>Current Time:</h3>
            <p>{{ now()->format('Y-m-d H:i:s') }}</p>
        </div>

        <div class="info">
            <h3>Next Steps:</h3>
            <p>If you can see this page, Laravel is working correctly. The issue is specifically with Inertia.js routes.</p>
            <p><strong>Check the browser console for JavaScript errors when accessing Inertia routes.</strong></p>
        </div>

        <div style="margin-top: 30px;">
            <a href="/ultra-simple" style="color: #007bff; text-decoration: none; margin-right: 20px;">← Ultra Simple Test</a>
            <a href="/simple-test" style="color: #007bff; text-decoration: none;">Try Inertia Test →</a>
        </div>
    </div>
</body>
</html>
