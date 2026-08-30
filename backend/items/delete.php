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


/* =========================================
   VALIDATE ID
========================================= */

if ($id <= 0) {

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Valid item id is required"
    ]);

    exit;
}


/* =========================================
   CHECK ITEM EXISTS
========================================= */

$check = $conn->prepare(
    "SELECT id FROM items WHERE id = ?"
);

$check->bind_param(
    "i",
    $id
);

$check->execute();

$result = $check->get_result();

if ($result->num_rows === 0) {

    http_response_code(404);

    echo json_encode([
        "success" => false,
        "message" => "Item not found"
    ]);

    $check->close();
    $conn->close();

    exit;
}

$check->close();


/* =========================================
   DELETE ITEM
========================================= */

$stmt = $conn->prepare(
    "DELETE FROM items WHERE id = ?"
);

if (!$stmt) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Failed to prepare delete query",
        "error" => $conn->error
    ]);

    exit;
}

$stmt->bind_param(
    "i",
    $id
);


/* =========================================
   EXECUTE
========================================= */

if ($stmt->execute()) {

    echo json_encode([
        "success" => true,
        "message" => "Item deleted successfully"
    ]);

} else {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Failed to delete item",
        "error" => $stmt->error
    ]);
}


$stmt->close();
$conn->close();

?>