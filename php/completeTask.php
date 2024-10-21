<?php
session_start();
include "dbConn.php"; // Database connection

$taskId = $_POST['taskId'];
$taskType = $_POST['taskType']; // 'request' or 'response'
$quantity = $_POST['quantity'];
$itemId = $_POST['itemId'];


if ($taskType == 'request') {
    // Update the 'requests' table
    $query = "UPDATE requests SET status = 'completed' WHERE id = '$taskId'";
    $query1 = "UPDATE items SET quantity = quantity - $quantity WHERE id = '$itemId'";
} else {
    // Update the 'citizen_responses' table
    $query = "UPDATE citizen_responses SET status = 'completed' WHERE id = '$taskId'";
    $query1 = "UPDATE items SET quantity = quantity + $quantity WHERE id = '$itemId'";
}

// Execute the first query
$result1 = mysqli_query($link, $query);

// Execute the second query if it's defined
if (isset($query1)) {
    $result2 = mysqli_query($link, $query1);
} else {
    $result2 = true; // Set it to true to indicate that it wasn't executed
}

if ($result1 && $result2) {
    echo json_encode("Task completed successfully");
} else {
    echo json_encode("Error completing task: " . mysqli_error($link));
}

mysqli_close($link);
?>
