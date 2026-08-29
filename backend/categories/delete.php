<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

require_once "../config/db.php";

if ($_SERVER["REQUEST_METHOD"] !== "DELETE") {
    http_response_code(405);

    echo json_encode([
        "success" => false,
        "message" => "Method not allowed"
    ]);

    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (!is_array($data)) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Invalid JSON data"
    ]);

    exit;
}

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

/*
 * Check if this category has subcategories
 */
$checkStmt = $conn->prepare(
    "SELECT COUNT(*) AS child_count
     FROM categories
     WHERE parent_id = ?"
);

if (!$checkStmt) {
    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Failed to check category children",
        "error" => $conn->error
    ]);

    exit;
}

$checkStmt->bind_param("i", $id);
$checkStmt->execute();

$result = $checkStmt->get_result();
$row = $result->fetch_assoc();

$checkStmt->close();

$childCount = (int)$row["child_count"];

if ($childCount > 0) {

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Cannot delete this category because it has subcategories"
    ]);

    exit;
}

/*
 * Delete category
 */
$stmt = $conn->prepare(
    "DELETE FROM categories
     WHERE id = ?"
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
        "message" => "Failed to delete category",
        "error" => $stmt->error
    ]);
}

$stmt->close();
$conn->close();

?>