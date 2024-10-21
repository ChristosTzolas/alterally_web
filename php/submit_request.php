<?php
	include "dbConn.php"; // Database connection file

	$userId = $_POST['userId'];
	$itemId = $_POST['itemId'];
	$quantity = $_POST['quantity'];
	$details = $_POST['requestDetails']; // Get response details from POST data

	// SQL to insert data
	$query = "INSERT INTO requests (user_id, item_id, people, created_at, details) VALUES ($userId, $itemId, $quantity, NOW(), '$details')";
	$result = mysqli_query($link, $query);

	if ($result) {
		echo 1; 
	} else {
		echo 0; 
	}

	mysqli_close($link);
?>