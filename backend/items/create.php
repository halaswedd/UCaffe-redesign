<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once "../config/db.php";

$data = json_decode(file_get_contents("php://input"), true);

if (
    !isset($data["category_id"]) ||
    !isset($data["name"]) ||
    !isset($data["price"])
) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "category_id, name and price are required"
    ]);

    exit;
}

$category_id = (int)$data["category_id"];
$name = trim($data["name"]);
$price = (float)$data["price"];

if ($category_id <= 0 || $name === "" || $price < 0) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Invalid item data"
    ]);

    exit;
}

$stmt = $conn->prepare(
    "INSERT INTO items (category_id, name, price)
     VALUES (?, ?, ?)"
);

$stmt->bind_param(
    "isd",
    $category_id,
    $name,
    $price
);

if ($stmt->execute()) {

    echo json_encode([
        "success" => true,
        "message" => "Item created successfully",
        "id" => $stmt->insert_id
    ]);

} else {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Failed to create item"
    ]);
}

$stmt->close();

?>