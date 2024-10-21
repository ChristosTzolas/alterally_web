<?php
include "dbConn.php";


// SQL query to fetch items based on the disaster type
$sql = "SELECT * FROM items ORDER BY quantity ASC";
$result = mysqli_query($link, $sql);

$items = mysqli_fetch_all($result, MYSQLI_ASSOC);

header('Content-Type: application/json');
echo json_encode($items);
?>
