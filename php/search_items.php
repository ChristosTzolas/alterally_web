<?php
	include "dbConn.php"; // Database connection file

	$searchQuery = $_POST['query'];

	$query = "SELECT id, name FROM items WHERE name LIKE '%$searchQuery%'";
	$result = mysqli_query($link, $query);

	$items = mysqli_fetch_all($result, MYSQLI_ASSOC);

	echo json_encode($items);

	mysqli_close($link);
?>
