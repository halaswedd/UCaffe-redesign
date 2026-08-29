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

$name = trim($_POST["name"] ?? "");
$parent_id = $_POST["parent_id"] ?? "";


/* =========================================
   VALIDATE NAME
========================================= */

if ($name === "") {

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Category name is required"
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
   IMAGE
========================================= */

$imagePath = null;


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


    /* Maximum 5MB */

    if ($_FILES["image"]["size"] > 5 * 1024 * 1024) {

        http_response_code(400);

        echo json_encode([
            "success" => false,
            "message" => "Image must be smaller than 5MB"
        ]);

        exit;
    }


    /* Check MIME type */

    $allowedTypes = [
        "image/jpeg" => "jpg",
        "image/png"  => "png",
        "image/webp" => "webp"
    ];


    $mimeType = mime_content_type(
        $_FILES["image"]["tmp_name"]
    );


    if (!isset($allowedTypes[$mimeType])) {

        http_response_code(400);

        echo json_encode([
            "success" => false,
            "message" => "Only JPG, PNG and WEBP images are allowed"
        ]);

        exit;
    }


    /* Create upload folder */

    $uploadDir = "../uploads/categories/";


    if (!is_dir($uploadDir)) {

        mkdir(
            $uploadDir,
            0777,
            true
        );
    }


    /* Unique filename */

    $extension = $allowedTypes[$mimeType];

    $fileName =
        "category_" .
        time() .
        "_" .
        uniqid() .
        "." .
        $extension;


    $targetPath =
        $uploadDir .
        $fileName;


    /* Move file */

    if (!move_uploaded_file(
        $_FILES["image"]["tmp_name"],
        $targetPath
    )) {

        http_response_code(500);

        echo json_encode([
            "success" => false,
            "message" => "Could not save uploaded image"
        ]);

        exit;
    }


    /* Path stored in database */

    $imagePath =
        "uploads/categories/" .
        $fileName;
}


/* =========================================
   INSERT CATEGORY
========================================= */

$stmt = $conn->prepare(
    "INSERT INTO categories
    (parent_id, name, image)
    VALUES (?, ?, ?)"
);


if (!$stmt) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Failed to prepare query",
        "error" => $conn->error
    ]);

    exit;
}


$stmt->bind_param(
    "iss",
    $parent_id,
    $name,
    $imagePath
);


/* =========================================
   EXECUTE
========================================= */

if ($stmt->execute()) {

    echo json_encode([
        "success" => true,
        "message" => "Category created successfully",
        "id" => $stmt->insert_id,
        "image" => $imagePath
    ]);

} else {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Failed to create category",
        "error" => $stmt->error
    ]);
}


$stmt->close();
$conn->close();

?>