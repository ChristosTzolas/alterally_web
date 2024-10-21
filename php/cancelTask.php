<?php
session_start();
include "dbConn.php"; // Database connection

$taskId = $_POST['taskId'];
$taskType = $_POST['taskType']; // 'request' or 'response'

if ($taskType == 'request') {
    $query = "UPDATE requests SET status = 'pending', taken_over_by = NULL WHERE id = '$taskId'";
} else {
    $query = "UPDATE citizen_responses SET status = 'pending', taken_over_by = NULL WHERE id = '$taskId'";
}

$result = mysqli_query($link, $query);

if ($result) {
    echo json_encode("Task cancelled successfully");
} else {
    echo json_encode("Error cancelling task: " . mysqli_error($link));

}

mysqli_close($link);
?>
