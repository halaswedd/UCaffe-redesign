<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

require_once "../config/db.php";

$sql = "
    SELECT
        i.id,
        i.category_id,
        i.name,
        i.price,
        i.created_at,
        i.updated_at,
        c.name AS category_name
    FROM items i
    LEFT JOIN categories c
        ON i.category_id = c.id
    ORDER BY i.id ASC
";

$result = $conn->query($sql);

if (!$result) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Failed to load items",
        "error" => $conn->error
    ]);

    exit;
}

$items = [];

while ($row = $result->fetch_assoc()) {

    $items[] = [
        "id" => (int)$row["id"],
        "category_id" => $row["category_id"] !== null
            ? (int)$row["category_id"]
            : null,
        "name" => $row["name"],
        "price" => (float)$row["price"],
        "category_name" => $row["category_name"],
        "created_at" => $row["created_at"],
        "updated_at" => $row["updated_at"]
    ];
}

echo json_encode([
    "success" => true,
    "data" => $items
]);

$conn->close();

?>