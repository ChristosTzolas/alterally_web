<?php
include "dbConn.php";
session_start();

$disaster_id = isset($_POST['disaster_id']) ? $_POST['disaster_id'] : '';

if (!is_numeric($disaster_id)) {
    echo json_encode(['error' => 'Invalid input']);
    exit;
}

$sql = "SELECT `id`, `name`, `description` FROM `items` WHERE `disaster_id` = $disaster_id";
$result = mysqli_query($link, $sql);
$items = array();

while ($row = mysqli_fetch_assoc($result)) {
    $items[] = $row;
}

header('Content-Type: application/json');
echo json_encode($items);
?>
