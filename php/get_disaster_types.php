<?php
	include "dbConn.php";

	// Fetch all disaster types from the database
	$sql = "SELECT id, name FROM disaster_type ORDER BY name ASC";
	$result = mysqli_query($link, $sql);//Save data to result

	$disasterTypes = mysqli_fetch_all($result, MYSQLI_ASSOC);//return data as an associative array and store it to disasterTypes

	header('Content-Type: application/json'); //exchange data client - server type json
	echo json_encode($disasterTypes);//php to json and return to client
?>
