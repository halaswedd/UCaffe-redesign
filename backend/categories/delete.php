<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: DELETE");
header("Access-Control-Allow-Headers: Content-Type");

require_once "../config/db.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data["id"])) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Category id is required"
    ]);

    exit;
}

$id = (int)$data["id"];

if ($id <= 0) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Invalid category id"
    ]);

    exit;
}

$stmt = $conn->prepare(
    "DELETE FROM categories WHERE id = ?"
);

$stmt->bind_param("i", $id);

if ($stmt->execute()) {

    if ($stmt->affected_rows > 0) {

        echo json_encode([
            "success" => true,
            "message" => "Category deleted successfully"
        ]);

    } else {

        http_response_code(404);

        echo json_encode([
            "success" => false,
            "message" => "Category not found"
        ]);
    }

} else {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Failed to delete category"
    ]);
}

$stmt->close();

?>