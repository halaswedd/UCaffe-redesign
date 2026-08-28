<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once "../config/db.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data["name"])) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Category name is required"
    ]);

    exit;
}

$name = trim($data["name"]);

$parent_id = null;

if (isset($data["parent_id"]) && $data["parent_id"] !== null && $data["parent_id"] !== "") {
    $parent_id = (int)$data["parent_id"];
}

$image = null;

if (isset($data["image"]) && $data["image"] !== "") {
    $image = trim($data["image"]);
}

if ($name === "") {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Category name cannot be empty"
    ]);

    exit;
}

$stmt = $conn->prepare(
    "INSERT INTO categories (parent_id, name, image)
     VALUES (?, ?, ?)"
);

$stmt->bind_param(
    "iss",
    $parent_id,
    $name,
    $image
);

if ($stmt->execute()) {

    echo json_encode([
        "success" => true,
        "message" => "Category created successfully",
        "id" => $stmt->insert_id
    ]);

} else {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Failed to create category"
    ]);
}

$stmt->close();

?>