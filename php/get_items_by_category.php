<?php
	include "dbConn.php"; // Database connection file

	$categoryId = $_POST['categoryId'];

	$query = "SELECT id, name FROM items WHERE disaster_id = '$categoryId'";
	$result = mysqli_query($link, $query);

	$items = mysqli_fetch_all($result, MYSQLI_ASSOC);

	echo json_encode($items); // Sending both ID and name for items

	mysqli_close($link);
?>
