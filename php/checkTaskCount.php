<?php
session_start();
include "dbConn.php"; 

$rescuerId = $_POST['rescuerId'];
$maxTasks = 4;

// Query to count tasks in 'requests'
$query1 = "SELECT COUNT(*) as taskCount FROM requests WHERE taken_over_by = $rescuerId AND status ='accepted'";

// Query to count tasks in 'citizen_responses'
$query2 = "SELECT COUNT(*) as taskCount FROM citizen_responses WHERE taken_over_by = $rescuerId AND status ='accepted'";

$result1 = mysqli_query($link, $query1);
$result2 = mysqli_query($link, $query2);

if ($result1 && $result2) {
    $row1 = mysqli_fetch_assoc($result1);
    $row2 = mysqli_fetch_assoc($result2);
    $totalTasks = $row1['taskCount'] + $row2['taskCount'];

    if ($totalTasks < $maxTasks) {
        echo 1; // Rescuer can take a new task
    } else {
        echo 0; // Rescuer cannot take a new task
    }
} else {
    echo "Error: " . mysqli_error($link); // Output MySQL error if query fails
}

// Close the database connection
mysqli_close($link);
?>