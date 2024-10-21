<?php
session_start();
include "dbConn.php"; // Database connection

// Assuming that 'users' table contains 'latitude' and 'longitude' fields
$query = "SELECT users.latitude, users.longitude FROM users JOIN citizen_responses ON users.user_id = citizen_responses.citizen_id WHERE citizen_responses.status = 'pending'";

$result = mysqli_query($link, $query);

$locations = mysqli_fetch_all($result, MYSQLI_ASSOC);
echo json_encode($locations);
?>
