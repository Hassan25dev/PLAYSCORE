@echo off
echo ========================================
echo PlayScore v3 Diagnostic Script
echo ========================================
echo.

echo 1. Checking Node.js and npm versions...
node --version
npm --version
echo.

echo 2. Checking if Vite dev server is running...
netstat -an | findstr :5173
echo.

echo 3. Clearing Laravel caches...
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear
echo.

echo 4. Checking Laravel logs for errors...
if exist "storage\logs\laravel.log" (
    echo Last 10 lines of Laravel log:
    powershell "Get-Content storage\logs\laravel.log -Tail 10"
) else (
    echo No Laravel log file found.
)
echo.

echo 5. Installing/updating npm dependencies...
npm install
echo.

echo 6. Building assets...
npm run build
echo.

echo 7. Starting Vite dev server...
echo You can now test the application at: http://localhost:8000
echo Test the simple Inertia page at: http://localhost:8000/inertia-test
echo.
echo Press Ctrl+C to stop the dev server when done testing.
npm run dev
