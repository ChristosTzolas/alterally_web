<?php
include "dbConn.php"; // Your database connection file

$username = $_GET['username'] ?? ''; // Assuming you're passing the username as a GET parameter

// SQL query. Ensure this query is correct and matches your database structure
$query = "select * from citizen_responses join users on citizen_id = users.user_id where users.username = '$username'"; 

$result = mysqli_query($link, $query);

if (!$result) {
    // Query failed. Output error and exit.
    echo "Error: " . mysqli_error($link);
    exit;
}

$responses = array();
while ($row = mysqli_fetch_assoc($result)) {
    $responses[] = $row;
}

echo json_encode($responses);

mysqli_close($link);
?>
