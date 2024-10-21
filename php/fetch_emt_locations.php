<?php
	session_start();
	include "dbConn.php"; // Database connection file

	// Prepare an array to hold the response
	$emtData = array();

	// Query to fetch EMT users' locations and their taken over tasks
	$query = "SELECT u.user_id, u.username, u.name, u.latitude, u.longitude, u.phone, 
			  r.id as request_id, cr.id as response_id, GROUP_CONCAT(c.item_id) AS cargo_items, 
			  GROUP_CONCAT(c.quantity) AS cargo_quantities FROM users u LEFT JOIN requests r 
			  ON u.user_id = r.taken_over_by AND r.status IN ('accepted', 'completed') LEFT JOIN
			 citizen_responses cr ON u.user_id = cr.taken_over_by AND cr.status IN ('accepted', 'completed')
			 LEFT JOIN cargo c ON u.user_id = c.user_id WHERE u.role = 'emt' GROUP BY u.user_id;
			 ";

	$result = mysqli_query($link, $query);

	if ($result) {
		while ($row = mysqli_fetch_assoc($result)) {
			$emtData[] = $row;
		}
	}

	// Close the database connection
	mysqli_close($link);

	// Return the response data as JSON
	echo json_encode($emtData);
?>
