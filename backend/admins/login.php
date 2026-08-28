<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once "../config/db.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data["username"]) || !isset($data["password"])) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Username and password are required"
    ]);

    exit;
}

$username = trim($data["username"]);
$password = $data["password"];

$stmt = $conn->prepare(
    "SELECT id, username, password
     FROM admins
     WHERE username = ?
     LIMIT 1"
);

$stmt->bind_param("s", $username);
$stmt->execute();

$result = $stmt->get_result();
$admin = $result->fetch_assoc();

if (!$admin || !password_verify($password, $admin["password"])) {

    http_response_code(401);

    echo json_encode([
        "success" => false,
        "message" => "Invalid username or password"
    ]);

    exit;
}

echo json_encode([
    "success" => true,
    "message" => "Login successful",
    "admin" => [
        "id" => $admin["id"],
        "username" => $admin["username"]
    ]
]);

$stmt->close();

?>