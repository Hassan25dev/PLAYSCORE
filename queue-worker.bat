@echo off
echo Starting Laravel Queue Worker...
cd %~dp0
php artisan queue:work --tries=3 --timeout=90
