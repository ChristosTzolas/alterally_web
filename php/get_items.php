<?php
	include "dbConn.php";

	$disasterTypeId = isset($_GET['disasterTypeId']) ? $_GET['disasterTypeId'] : '';

	// SQL query to fetch items based on the disaster type
	$sql = "SELECT * FROM items WHERE disaster_id = '$disasterTypeId' ORDER BY name ASC";
	$result = mysqli_query($link, $sql);

	$items = mysqli_fetch_all($result, MYSQLI_ASSOC);

	header('Content-Type: application/json');
	echo json_encode($items);
?>
