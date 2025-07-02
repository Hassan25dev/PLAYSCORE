@echo off
echo Stopping any existing PHP processes...
taskkill /f /im php.exe >nul 2>&1

echo Clearing Laravel caches...
php artisan config:clear
php artisan route:clear
php artisan cache:clear

echo Starting Laravel development server...
php artisan serve --host=127.0.0.1 --port=8000

pause
