<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

require_once "../config/db.php";

$sql = "SELECT id, parent_id, name, image
        FROM categories
        ORDER BY id ASC";

$result = $conn->query($sql);

if (!$result) {
    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Failed to fetch categories"
    ]);

    exit;
}

$categories = [];

while ($row = $result->fetch_assoc()) {
    $categories[] = $row;
}

echo json_encode([
    "success" => true,
    "data" => $categories
]);

?>