<?php

$host = getenv("DB_HOST");
$port = getenv("DB_PORT");
$user = getenv("DB_USER");
$password = getenv("DB_PASSWORD");
$database = getenv("DB_NAME");

$conn = new mysqli($host, $user, $password, $database, $port);

if ($conn->connect_error) {
    die("DB ERROR: " . $conn->connect_error);
}

echo "✅ DATABASE CONNECTED SUCCESSFULLY!";
?>