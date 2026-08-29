<?php

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

require_once "../config/db.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);

    echo json_encode([
        "success" => false,
        "message" => "Only POST requests are allowed"
    ]);

    exit;
}

$data = json_decode(
    file_get_contents("php://input"),
    true
);

if (
    !isset($data["email"]) ||
    !isset($data["password"])
) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Email and password are required"
    ]);

    exit;
}

$email = trim($data["email"]);
$password = $data["password"];


$stmt = $conn->prepare(
    "SELECT id, username, password
     FROM admins
     WHERE username = ?
     LIMIT 1"
);

if (!$stmt) {
    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Failed to prepare login query"
    ]);

    exit;
}


$stmt->bind_param("s", $email);

$stmt->execute();

$result = $stmt->get_result();

$admin = $result->fetch_assoc();


if (
    !$admin ||
    !password_verify(
        $password,
        $admin["password"]
    )
) {
    http_response_code(401);

    echo json_encode([
        "success" => false,
        "message" => "Invalid email or password"
    ]);

    $stmt->close();

    exit;
}


echo json_encode([
    "success" => true,
    "message" => "Login successful",

    "admin" => [
        "id" => $admin["id"],
        "email" => $admin["username"]
    ]
]);

$stmt->close();

?>