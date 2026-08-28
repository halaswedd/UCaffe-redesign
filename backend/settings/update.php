<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT");
header("Access-Control-Allow-Headers: Content-Type");

require_once "../config/db.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data["id"])) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Settings id is required"
    ]);

    exit;
}

$id = (int)$data["id"];

$whatsapp = isset($data["whatsapp"]) ? trim($data["whatsapp"]) : null;
$instagram = isset($data["instagram"]) ? trim($data["instagram"]) : null;
$location = isset($data["location"]) ? trim($data["location"]) : null;
$opening_hours = isset($data["opening_hours"]) ? trim($data["opening_hours"]) : null;
$opening_image = isset($data["opening_image"]) ? trim($data["opening_image"]) : null;

$stmt = $conn->prepare(
    "UPDATE settings
     SET whatsapp = ?,
         instagram = ?,
         location = ?,
         opening_hours = ?,
         opening_image = ?
     WHERE id = ?"
);

$stmt->bind_param(
    "sssssi",
    $whatsapp,
    $instagram,
    $location,
    $opening_hours,
    $opening_image,
    $id
);

if ($stmt->execute()) {

    echo json_encode([
        "success" => true,
        "message" => "Settings updated successfully"
    ]);

} else {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Failed to update settings"
    ]);
}

$stmt->close();

?>