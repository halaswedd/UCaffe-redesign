<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT");
header("Access-Control-Allow-Headers: Content-Type");

require_once "../config/db.php";

$data = json_decode(file_get_contents("php://input"), true);

if (
    !isset($data["id"]) ||
    !isset($data["category_id"]) ||
    !isset($data["name"]) ||
    !isset($data["price"])
) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "id, category_id, name and price are required"
    ]);

    exit;
}

$id = (int)$data["id"];
$category_id = (int)$data["category_id"];
$name = trim($data["name"]);
$price = (float)$data["price"];

if ($id <= 0 || $category_id <= 0 || $name === "" || $price < 0) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Invalid item data"
    ]);

    exit;
}

$stmt = $conn->prepare(
    "UPDATE items
     SET category_id = ?, name = ?, price = ?
     WHERE id = ?"
);

$stmt->bind_param(
    "isdi",
    $category_id,
    $name,
    $price,
    $id
);

if ($stmt->execute()) {

    echo json_encode([
        "success" => true,
        "message" => "Item updated successfully"
    ]);

} else {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Failed to update item"
    ]);
}

$stmt->close();

?>