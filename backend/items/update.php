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

$id = (int)($data["id"] ?? 0);
$name = trim($data["name"] ?? "");
$category_id = $data["category_id"] ?? "";
$price = $data["price"] ?? "";
$currency = strtoupper(trim($data["currency"] ?? "LL"));


/* =========================================
   VALIDATE ID + NAME
========================================= */

if ($id <= 0 || $name === "") {

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "id and name are required"
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
   VALIDATE CURRENCY
========================================= */

if (!in_array($currency, ["USD", "LL"], true)) {

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Currency must be USD or LL"
    ]);

    exit;
}


/* =========================================
   CHECK ITEM EXISTS
========================================= */

$itemCheck = $conn->prepare(
    "SELECT id FROM items WHERE id = ?"
);

$itemCheck->bind_param(
    "i",
    $id
);

$itemCheck->execute();

$itemResult = $itemCheck->get_result();

if ($itemResult->num_rows === 0) {

    http_response_code(404);

    echo json_encode([
        "success" => false,
        "message" => "Item not found"
    ]);

    $itemCheck->close();
    $conn->close();

    exit;
}

$itemCheck->close();


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
   UPDATE ITEM
========================================= */

$stmt = $conn->prepare(
    "UPDATE items
     SET category_id = ?,
         name = ?,
         price = ?,
         currency = ?
     WHERE id = ?"
);

if (!$stmt) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Failed to prepare update query",
        "error" => $conn->error
    ]);

    exit;
}

$stmt->bind_param(
    "isdsi",
    $category_id,
    $name,
    $price,
    $currency,
    $id
);


/* =========================================
   EXECUTE
========================================= */

if ($stmt->execute()) {

    echo json_encode([
        "success" => true,
        "message" => "Item updated successfully",
        "data" => [
            "id" => $id,
            "category_id" => $category_id,
            "name" => $name,
            "price" => $price,
            "currency" => $currency
        ]
    ]);

} else {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Failed to update item",
        "error" => $stmt->error
    ]);
}


$stmt->close();
$conn->close();

?>