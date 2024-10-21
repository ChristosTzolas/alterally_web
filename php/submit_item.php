<?php
include "dbConn.php";
session_start();

$disaster_id = $_POST['disaster_id'];
$item_id = $_POST['item_id'];

// Perform your logic to handle the item submission
// This is where you would insert into a database or take other actions

// Dummy response for demonstration
$response = ['success' => true, 'message' => 'Item submitted successfully'];

header('Content-Type: application/json');
echo json_encode($response);
?>
