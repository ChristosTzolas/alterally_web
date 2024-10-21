<?php
session_start();
include "dbConn.php"; // Database connection

$userId = $_SESSION['user_id']; // Ensure this is set when the user logs in

$query = "SELECT username, email, name, phone FROM users WHERE user_id = '$userId'";
$result = mysqli_query($link, $query);

if ($row = mysqli_fetch_assoc($result)) {
    echo json_encode($row);
} else {
    echo "Error fetching user data";
}

mysqli_close($link);
?>
