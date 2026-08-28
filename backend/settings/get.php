<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

require_once "../config/db.php";

$sql = "SELECT id, whatsapp, instagram, location, opening_hours, opening_image
        FROM settings
        ORDER BY id ASC
        LIMIT 1";

$result = $conn->query($sql);

if (!$result) {
    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Failed to fetch settings"
    ]);

    exit;
}

$settings = $result->fetch_assoc();

echo json_encode([
    "success" => true,
    "data" => $settings
]);

?>