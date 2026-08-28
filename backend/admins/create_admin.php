<?php

require_once "../config/db.php";

$username = "admin@ucafe.com";
$password = "ucafe1234$";

$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

$stmt = $conn->prepare(
    "INSERT INTO admins (username, password)
     VALUES (?, ?)"
);

$stmt->bind_param("ss", $username, $hashedPassword);

if ($stmt->execute()) {
    echo "Admin created successfully";
} else {
    echo "Error: " . $stmt->error;
}

$stmt->close();
?>