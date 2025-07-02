<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "Testing email configuration...\n";

try {
    $mailer = app('mailer');
    $mailer->raw('Test email from PlayScore', function($message) {
        $message->to(env('MAIL_FROM_ADDRESS'))
                ->subject('Test Email Configuration');
    });
    
    echo "Email sent successfully! Check your inbox.\n";
} catch (Exception $e) {
    echo "Error sending email: " . $e->getMessage() . "\n";
}
