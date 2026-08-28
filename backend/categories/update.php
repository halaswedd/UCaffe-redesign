<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT");
header("Access-Control-Allow-Headers: Content-Type");

require_once "../config/db.php";

$data = json_decode(file_get_contents("php://input"), true);

if (
    !isset($data["id"]) ||
    !isset($data["name"])
) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "id and name are required"
    ]);

    exit;
}

$id = (int)$data["id"];
$name = trim($data["name"]);

$parent_id = null;

if (
    isset($data["parent_id"]) &&
    $data["parent_id"] !== null &&
    $data["parent_id"] !== ""
) {
    $parent_id = (int)$data["parent_id"];
}

$image = null;

if (isset($data["image"]) && $data["image"] !== "") {
    $image = trim($data["image"]);
}

if ($id <= 0 || $name === "") {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Invalid category data"
    ]);

    exit;
}

$stmt = $conn->prepare(
    "UPDATE categories
     SET parent_id = ?, name = ?, image = ?
     WHERE id = ?"
);

$stmt->bind_param(
    "issi",
    $parent_id,
    $name,
    $image,
    $id
);

if ($stmt->execute()) {

    if ($stmt->affected_rows > 0) {

        echo json_encode([
            "success" => true,
            "message" => "Category updated successfully"
        ]);

    } else {

        echo json_encode([
            "success" => true,
            "message" => "No changes made"
        ]);
    }

} else {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Failed to update category"
    ]);
}

$stmt->close();

?>