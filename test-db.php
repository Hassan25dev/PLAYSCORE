<?php
try {
    echo "Testing MySQL connection...\n";
    $pdo = new PDO('mysql:host=127.0.0.1;port=3306', 'root', '');
    echo "✓ MySQL server connection successful\n";
    
    // Test specific database
    $pdo = new PDO('mysql:host=127.0.0.1;port=3306;dbname=gamrat', 'root', '');
    echo "✓ Database 'gamrat' connection successful\n";
    
    // Test a simple query
    $stmt = $pdo->query('SELECT 1 as test');
    $result = $stmt->fetch();
    echo "✓ Query execution successful: " . $result['test'] . "\n";
    
} catch(Exception $e) {
    echo "✗ Database connection failed: " . $e->getMessage() . "\n";
    echo "Error Code: " . $e->getCode() . "\n";
}
?>
