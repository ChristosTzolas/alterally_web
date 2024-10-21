<?php
	session_start();
	include "dbConn.php"; // Database connection

	// Fetching the base location
	$query = "SELECT * FROM base LIMIT 1";
	$result = mysqli_query($link, $query);

	if ($row = mysqli_fetch_assoc($result)) {
		echo json_encode($row);
	} else {
		echo "Error fetching base location";
	}

	mysqli_close($link);
?>
