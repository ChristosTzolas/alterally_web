<?php
session_start();
include "dbConn.php"; // Database connection

$query = "SELECT * FROM items WHERE location = 'base'";
$result = mysqli_query($link, $query);

$items = mysqli_fetch_all($result, MYSQLI_ASSOC);
echo json_encode($items);
?>