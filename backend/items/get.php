<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

require_once "../config/db.php";

$sql = "SELECT id, category_id, name, price
        FROM items
        ORDER BY id ASC";

$result = $conn->query($sql);

if (!$result) {
    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Failed to fetch items"
    ]);

    exit;
}

$items = [];

while ($row = $result->fetch_assoc()) {
    $items[] = $row;
}

echo json_encode([
    "success" => true,
    "data" => $items
]);

?>