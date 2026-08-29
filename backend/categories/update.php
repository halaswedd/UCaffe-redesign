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
   GET FORM DATA
========================================= */

$id = (int)($_POST["id"] ?? 0);
$name = trim($_POST["name"] ?? "");
$parent_id = $_POST["parent_id"] ?? "";
$removeImage = isset($_POST["remove_image"]) && $_POST["remove_image"] === "1";


/* =========================================
   VALIDATE
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
   PARENT CATEGORY
========================================= */

if ($parent_id === "" || $parent_id === "0") {
    $parent_id = null;
} else {
    $parent_id = (int)$parent_id;
}


/* =========================================
   GET CURRENT IMAGE (needed to delete old file)
========================================= */

$currentImage = null;

$checkStmt = $conn->prepare("SELECT image FROM categories WHERE id = ?");
$checkStmt->bind_param("i", $id);
$checkStmt->execute();
$checkResult = $checkStmt->get_result();
$currentRow = $checkResult->fetch_assoc();
$checkStmt->close();

if ($currentRow) {
    $currentImage = $currentRow["image"];
}


/* =========================================
   IMAGE (new upload OR remove)
========================================= */

$imagePath = null;
$updateImage = false;

if (isset($_FILES["image"]) &&
    $_FILES["image"]["error"] !== UPLOAD_ERR_NO_FILE) {

    if ($_FILES["image"]["error"] !== UPLOAD_ERR_OK) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Failed to upload image"
        ]);
        exit;
    }

    if ($_FILES["image"]["size"] > 5 * 1024 * 1024) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Image must be smaller than 5MB"
        ]);
        exit;
    }

    $allowedTypes = [
        "image/jpeg" => "jpg",
        "image/png"  => "png",
        "image/webp" => "webp"
    ];

    $mimeType = mime_content_type($_FILES["image"]["tmp_name"]);

    if (!isset($allowedTypes[$mimeType])) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Only JPG, PNG and WEBP images are allowed"
        ]);
        exit;
    }

    $uploadDir = "../uploads/categories/";

    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    $extension = $allowedTypes[$mimeType];
    $fileName = "category_" . time() . "_" . uniqid() . "." . $extension;
    $targetPath = $uploadDir . $fileName;

    if (!move_uploaded_file($_FILES["image"]["tmp_name"], $targetPath)) {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Could not save uploaded image"
        ]);
        exit;
    }

    /* delete the old image file since we're replacing it */
    if ($currentImage) {
        $oldPath = "../" . $currentImage;
        if (file_exists($oldPath)) {
            unlink($oldPath);
        }
    }

    $imagePath = "uploads/categories/" . $fileName;
    $updateImage = true;

} elseif ($removeImage) {

    /* delete the old image file from disk */
    if ($currentImage) {
        $oldPath = "../" . $currentImage;
        if (file_exists($oldPath)) {
            unlink($oldPath);
        }
    }

    $imagePath = null;
    $updateImage = true;
}


/* =========================================
   BUILD + RUN QUERY
========================================= */

if ($updateImage) {

    $stmt = $conn->prepare(
        "UPDATE categories
         SET parent_id = ?, name = ?, image = ?
         WHERE id = ?"
    );

    $stmt->bind_param("issi", $parent_id, $name, $imagePath, $id);

} else {

    $stmt = $conn->prepare(
        "UPDATE categories
         SET parent_id = ?, name = ?
         WHERE id = ?"
    );

    $stmt->bind_param("isi", $parent_id, $name, $id);
}

if (!$stmt) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Failed to prepare update query",
        "error" => $conn->error
    ]);
    exit;
}

if ($stmt->execute()) {

    echo json_encode([
        "success" => true,
        "message" => "Category updated successfully"
    ]);

} else {

    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Failed to update category",
        "error" => $stmt->error
    ]);
}

$stmt->close();
$conn->close();

?>