<?php
include "dbConn.php"; // Database connection file

$userId = $_POST['userId'];

$query = "SELECT items.name, created_at, status FROM requests INNER JOIN items ON requests.item_id = items.id WHERE user_id = $userId";
$result = mysqli_query($link, $query);

$items = mysqli_fetch_all($result, MYSQLI_ASSOC);

echo json_encode($items);

mysqli_close($link);
?>


