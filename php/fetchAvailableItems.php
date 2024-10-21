<?php
session_start();
include "dbConn.php"; // Database connection

// Fetching the base location
$query = "SELECT * FROM items";
$result = mysqli_query($link, $query);


$items = [];
while ($row = mysqli_fetch_assoc($result)) {
    $items[] = $row;
}

echo json_encode($items);
mysqli_close($link);
?>
