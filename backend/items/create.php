<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    exit;
}

require_once "../config/db.php";


/* =========================================
   GET DATA
========================================= */

$data = json_decode(
    file_get_contents("php://input"),
    true
);

$name = trim($data["name"] ?? "");
$category_id = $data["category_id"] ?? "";
$price = $data["price"] ?? "";


/* =========================================
   VALIDATE NAME
========================================= */

if ($name === "") {

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Item name is required"
    ]);

    exit;
}


/* =========================================
   VALIDATE CATEGORY
========================================= */

if ($category_id === "" || $category_id === null) {

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Category is required"
    ]);

    exit;
}

$category_id = (int)$category_id;

if ($category_id <= 0) {

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Invalid category"
    ]);

    exit;
}


/* =========================================
   VALIDATE PRICE
========================================= */

if ($price === "" || !is_numeric($price)) {

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Valid price is required"
    ]);

    exit;
}

$price = (float)$price;

if ($price < 0) {

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Price cannot be negative"
    ]);

    exit;
}


/* =========================================
   CHECK CATEGORY EXISTS
========================================= */

$categoryCheck = $conn->prepare(
    "SELECT id FROM categories WHERE id = ?"
);

$categoryCheck->bind_param(
    "i",
    $category_id
);

$categoryCheck->execute();

$categoryResult = $categoryCheck->get_result();

if ($categoryResult->num_rows === 0) {

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Selected category does not exist"
    ]);

    $categoryCheck->close();
    $conn->close();

    exit;
}

$categoryCheck->close();


/* =========================================
   INSERT ITEM
========================================= */

$stmt = $conn->prepare(
    "INSERT INTO items
        (category_id, name, price)
     VALUES
        (?, ?, ?)"
);

if (!$stmt) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Failed to prepare insert query",
        "error" => $conn->error
    ]);

    exit;
}

$stmt->bind_param(
    "isd",
    $category_id,
    $name,
    $price
);


/* =========================================
   EXECUTE
========================================= */

if ($stmt->execute()) {

    echo json_encode([
        "success" => true,
        "message" => "Item created successfully",
        "data" => [
            "id" => $stmt->insert_id,
            "category_id" => $category_id,
            "name" => $name,
            "price" => $price
        ]
    ]);

} else {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Failed to create item",
        "error" => $stmt->error
    ]);
}


$stmt->close();
$conn->close();

?>