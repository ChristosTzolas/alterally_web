<?php
session_start();
include "dbConn.php"; // Database connection

$requestId = $_POST['requestId'];
$userId = $_POST['userId'];

$query = "UPDATE requests SET status = 'accepted', taken_over_by = '$userId' WHERE id = '$requestId'";
$result = mysqli_query($link, $query);

if ($result) {
    echo json_encode("Request taken over successfully");
} else {
    echo json_encode("Error taking over request");
}

mysqli_close($link);
?>
