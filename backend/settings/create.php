<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once "../config/db.php";

$data = json_decode(file_get_contents("php://input"), true);

$whatsapp = isset($data["whatsapp"]) ? trim($data["whatsapp"]) : null;
$instagram = isset($data["instagram"]) ? trim($data["instagram"]) : null;
$location = isset($data["location"]) ? trim($data["location"]) : null;
$opening_hours = isset($data["opening_hours"]) ? trim($data["opening_hours"]) : null;
$opening_image = isset($data["opening_image"]) ? trim($data["opening_image"]) : null;

$check = $conn->query("SELECT id FROM settings LIMIT 1");

if ($check && $check->num_rows > 0) {
    http_response_code(409);

    echo json_encode([
        "success" => false,
        "message" => "Settings already exist. Use update instead."
    ]);

    exit;
}

$stmt = $conn->prepare(
    "INSERT INTO settings
    (whatsapp, instagram, location, opening_hours, opening_image)
    VALUES (?, ?, ?, ?, ?)"
);

$stmt->bind_param(
    "sssss",
    $whatsapp,
    $instagram,
    $location,
    $opening_hours,
    $opening_image
);

if ($stmt->execute()) {

    echo json_encode([
        "success" => true,
        "message" => "Settings created successfully",
        "id" => $stmt->insert_id
    ]);

} else {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Failed to create settings"
    ]);
}

$stmt->close();

?>