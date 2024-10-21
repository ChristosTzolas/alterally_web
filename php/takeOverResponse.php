<?php
session_start();
include "dbConn.php"; // Database connection

$responseId = $_POST['responseId'];
$userId = $_POST['userId'];

$query = "UPDATE citizen_responses SET status = 'accepted', taken_over_by = '$userId' WHERE id = '$responseId'";
$result = mysqli_query($link, $query);

if ($result) {
    echo json_encode("Response taken over successfully");
} else {
    echo json_encode("Error taking over response");
}

mysqli_close($link);
?>
